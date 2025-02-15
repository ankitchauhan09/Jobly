    package com.jobapplication.service;


    import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
    import com.google.api.client.http.AbstractInputStreamContent;
    import com.google.api.client.http.HttpRequestInitializer;
    import com.google.api.client.http.InputStreamContent;
    import com.google.api.client.json.gson.GsonFactory;
    import com.google.api.services.drive.Drive;
    import com.google.api.services.drive.DriveScopes;
    import com.google.api.services.drive.model.File;
    import com.google.api.services.drive.model.FileList;
    import com.google.api.services.drive.model.Permission;
    import com.google.auth.http.HttpCredentialsAdapter;
    import com.google.auth.oauth2.GoogleCredentials;
    import jakarta.annotation.PostConstruct;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.stereotype.Service;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.FileInputStream;
    import java.io.IOException;
    import java.nio.file.Path;
    import java.nio.file.Paths;
    import java.security.GeneralSecurityException;
    import java.util.Collections;
    import java.util.List;
    import java.util.UUID;

    @Slf4j
    @Service
    public class GoogleDriveService {

        private static final String CREDENTIALS_FILE_PATH = getCredentialsPath();
        private Drive driveService;

        private static String getCredentialsPath() {
            String currentdir = System.getProperty("user.dir");
            Path path = Paths.get(currentdir, "src/main/resources/static/jobly-service-account-json.json");
            return path.toString();
        }

        @PostConstruct
        public void initializeDriveService() {
            try {
                FileInputStream inputStream = new FileInputStream(CREDENTIALS_FILE_PATH);
                GoogleCredentials credential = GoogleCredentials.fromStream(inputStream)
                        .createScoped(Collections.singleton(DriveScopes.DRIVE_FILE));

                HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credential);
                driveService = new Drive.Builder(
                        GoogleNetHttpTransport.newTrustedTransport(),
                        GsonFactory.getDefaultInstance(),
                        requestInitializer
                )
                        .setApplicationName("Jobly")
                        .build();
            } catch (IOException | GeneralSecurityException e) {
                log.error("Error initializing Google Drive service", e);
                throw new RuntimeException(e);
            }
        }

        public String uploadFileToDrive(MultipartFile file, String applicantId) throws IOException {
            try {
                File folder = getUserFolder(applicantId);
                if (folder == null) {
                    folder = createUserFolder(applicantId);
                }

                File metadataFile = new File();
                metadataFile.setName(file.getOriginalFilename() + System.currentTimeMillis());
                metadataFile.setMimeType(file.getContentType());
                assert folder != null;
                metadataFile.setParents(Collections.singletonList(folder.getId()));

                AbstractInputStreamContent inputStreamContent = new InputStreamContent(
                        file.getContentType(),
                        file.getInputStream()
                );

                File uploadedFile = driveService.files().create(metadataFile, inputStreamContent)
                        .setFields("id, parents")
                        .execute();

                setPermissionsForFile(uploadedFile);

                log.info("File uploaded with ID: {}", uploadedFile.getId());
                return uploadedFile.getId();
            } catch (IOException e) {
                log.error("Error uploading file to Drive", e);
                return null;
            }
        }

        private void setPermissionsForFile(File file) {
            Permission permissions = new Permission();
            permissions.setRole("reader");
            permissions.setType("anyone");

            try {
                driveService.permissions().create(file.getId(), permissions).execute();
            } catch (IOException e) {
                log.error("GoogleDriveUpload : Error while setting the permission" , e);
                throw new RuntimeException(e);
            }
        }

        private File createUserFolder(String applicantId) {
            try {
                File userFolder = new File();
                userFolder.setName(applicantId);
                userFolder.setMimeType("application/vnd.google-apps.folder");
                File file =  driveService.files().create(userFolder)
                        .setFields("id")
                        .execute();
                if(file != null) {
                    log.info("Folder created successfully with id : {}", file.getId());
                }
                assert file != null;
                setPermissionsForFile(file);
                return file;
            } catch (IOException e) {
                log.error("Error creating user folder", e);
                return null;
            }
        }

        private void setPermissionsForFolder(File file) {
        }

        private File getUserFolder(String applicantId) {
            try {
                String query = "name = '" + applicantId + "' and mimeType = 'application/vnd.google-apps.folder'";
                FileList fileList = driveService.files().list()
                        .setQ(query)
                        .setFields("files(id, name)")  // Corrected fields parameter
                        .execute();

                List<File> files = fileList.getFiles();
                log.info("folder fetched successfully with id : {}", files);
                return files != null && !files.isEmpty() ? files.get(0) : null;
            } catch (IOException e) {
                log.error("Error getting user folder", e);
                return null;
            }
        }
    }