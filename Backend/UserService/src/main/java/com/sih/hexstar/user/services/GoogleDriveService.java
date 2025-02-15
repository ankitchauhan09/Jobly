package com.sih.hexstar.user.services;

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
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class GoogleDriveService {

    private static final String CREDENTIALS_FIILE_PATH = getCredentialsPath();
    private Drive googleDriveService;

    private static String getCredentialsPath() {
        String currentDir = System.getProperty("user.dir");
        Path path = Paths.get(currentDir, "src/main/resources/static/jobly-service-account-json.json");
        return path.toString();
    }

    @PostConstruct
    public void initializeDriveService() {
        try {
            FileInputStream fileInputStream = new FileInputStream(CREDENTIALS_FIILE_PATH);
            GoogleCredentials credentials = GoogleCredentials.fromStream(fileInputStream)
                    .createScoped(Collections.singleton(DriveScopes.DRIVE_FILE));
            HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);
            googleDriveService = new Drive.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    requestInitializer
            )
                    .setApplicationName("Jobly")
                    .build();
        } catch (IOException | GeneralSecurityException e) {
            log.error("Error intializing the google drive service : {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public Mono<String> uploadFileToDrive(Mono<FilePart> fileMono, String userId) {
        return fileMono.flatMap(file -> {
            try {
                File folder = getUserFolder(userId);
                if (folder == null) {
                    folder = createUserFolder(userId);
                }

                final File finalFolder = folder;

                return DataBufferUtils.join(file.content())
                        .map(dataBuffer -> {
                            try {
                                byte[] bytes = new byte[dataBuffer.readableByteCount()];
                                dataBuffer.read(bytes);
                                DataBufferUtils.release(dataBuffer);

                                File metadataFile = new File()
                                        .setName(file.filename() + System.currentTimeMillis())
                                        .setMimeType(file.headers().getContentType().toString())
                                        .setParents(Collections.singletonList(finalFolder.getId()));

                                java.io.ByteArrayInputStream inputStream = new java.io.ByteArrayInputStream(bytes);
                                AbstractInputStreamContent content = new InputStreamContent(
                                        file.headers().getContentType().toString(),
                                        inputStream
                                );

                                File uploadedFile = googleDriveService.files()
                                        .create(metadataFile, content)
                                        .setFields("id")
                                        .execute();

                                setPermissionsForFile(uploadedFile);
                                log.info("File uploaded successfully: {}", uploadedFile.getId());
                                return uploadedFile.getId();
                            } catch (IOException e) {
                                log.error("Error uploading file: {}", e.getMessage());
                                throw new RuntimeException(e);
                            }
                        });
            } catch (Exception e) {
                return Mono.error(e);
            }
        });
    }
    private void setPermissionsForFile(File file) {
        Permission permissions = new Permission();
        permissions.setRole("reader");
        permissions.setType("anyone");

        try {
            googleDriveService.permissions().create(file.getId(), permissions).execute();
        } catch (IOException e) {
            log.error("GoogleDriveUpload : Error while setting the permission", e);
            throw new RuntimeException(e);
        }
    }

    private File createUserFolder(String applicantId) {
        try {
            File userFolder = new File();
            userFolder.setName(applicantId);
            userFolder.setMimeType("application/vnd.google-apps.folder");
            File file = googleDriveService.files().create(userFolder)
                    .setFields("id")
                    .execute();
            if (file != null) {
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
            FileList fileList = googleDriveService.files().list()
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
