package com.sih.hexstar.user.services;//package com.sih.hexstar.user.services.serviceimpl;
//
//import com.sih.hexstar.user.dto.UserDto;
//import com.sih.hexstar.user.entities.User;
//import com.sih.hexstar.user.repositories.UserRepo;
//import lombok.AllArgsConstructor;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//@Service
//@AllArgsConstructor
//public class UserServiceImpl implements UserService {
//
//    @Autowired
//    private UserRepo userRepo;
//
//    @Autowired
//    private ModelMapper modelMapper;
//
//    @Override
//    public UserDto getUserByEmail(String email) {
//        User user = this.userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));
//        return this.modelMapper.map(user, UserDto.class);
//    }
//
//    @Override
//    public UserDto getUserById(String id) {
//        User user = this.userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//        return this.modelMapper.map(user, UserDto.class);
//    }
//
//    @Override
//    public void deleteUser(String id) {
//        User user = this.userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//        this.userRepo.delete(user);
//    }
//
//    @Override
//    public UserDto updateUser(String id, UserDto userDto) {
//        User user = this.userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
//        user.setEmail(userDto.getEmail());
//        user.setName(userDto.getName());
//        user.setContact(userDto.getContact());
//        user.setRoleName(userDto.getRoleName());
//        User updatedUser = this.userRepo.save(user);
//        return this.modelMapper.map(updatedUser, UserDto.class);
//    }
//
//}

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.hexstar.user.dto.UserDto;
import com.sih.hexstar.user.entities.User;
import com.sih.hexstar.user.payloads.Education;
import com.sih.hexstar.user.payloads.SkillPayload;
import com.sih.hexstar.user.payloads.SocialLinks;
import com.sih.hexstar.user.repositories.UserRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class UserServiceImpl {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ObjectMapper objectMapper;

    private final GoogleDriveService googleDriveService;

    public UserServiceImpl(GoogleDriveService googleDriveService) throws GeneralSecurityException, IOException {
        this.googleDriveService = googleDriveService;
    }

    public Mono<UserDto> getUserById(String id) {
        return userRepo.findById(id)
                .map(this::convertToDto);
    }

    public Mono<UserDto> getUserByEmail(String email) {
        return userRepo.findUserByEmail(email)
                .map(this::convertToDto)
                .doOnError(error -> log.error("Error occurred while fetching user with email : {} {}", email, error.getMessage()));
    }

    public Mono<Void> deleteUserById(String id) {
        return userRepo.deleteById(id)
                .doOnSuccess(success -> log.info("User deleted successfully with id : {}", id))
                .doOnError(error -> log.error("Error occurred while deleting user with id : {}", id));
    }

    public Mono<UserDto> updateUser(UserDto userDto) {
        return Mono.just(userDto)
                .map(this::convertToEntity)
                .flatMap(newUserInfo -> {
                    return userRepo.save(newUserInfo)
                            .map(this::convertToDto);
                });
    }

    public Mono<UserDto> updateUserProfilePic(String userId, Mono<FilePart> profilePic) {
        return userRepo.findById(userId)
                .flatMap(fetchedUser -> {
                    return googleDriveService.uploadFileToDrive(profilePic, userId)
                            .flatMap(profilePicUrl -> {
                                fetchedUser.setProfilePicUrl(profilePicUrl);
                                return userRepo.updateUserProfilePicUrl(profilePicUrl, userId)
                                        .then(Mono.just(convertToDto(fetchedUser)));
                            });
                });
    }

    private User convertToEntity(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setDescription(userDto.getDescription());
        user.setContact(userDto.getContact());
        user.setRoleName(userDto.getRoleName());
        user.setProfilePicUrl(userDto.getProfilePicUrl());
        if (!userDto.getSocialLinks().isEmpty()) {
            try {
                String userSocialLinksJsonString = objectMapper.writeValueAsString(userDto.getSocialLinks());
                user.setSocialLinks(userSocialLinksJsonString);
            } catch (IOException e) {
                user.setSocialLinks("");
                log.error("Error while parsing the user social links : {}", e.getMessage());
            }
        } else {
            user.setSocialLinks("");
        }
        if (!userDto.getSkills().isEmpty()) {
            try {
                String userSkillsJsonString = objectMapper.writeValueAsString(userDto.getSkills());
                user.setSkills(userSkillsJsonString);
            } catch (JsonProcessingException e) {
                user.setSkills("");
                log.error("Error while parsing the user skills in convertToEntity method : {}", e.getMessage());
            }
        } else {
            user.setSkills("");
        }
        if (!userDto.getEducations().isEmpty()) {
            try {
                String userEducationsJsonString = objectMapper.writeValueAsString(userDto.getEducations());
                user.setEducations(userEducationsJsonString);
            } catch (JsonProcessingException e) {
                user.setEducations("");
                log.error("Error while parsing the user educations in convertToEntity method : {}", e.getMessage());
            }
        } else {
            user.setEducations("");
        }
        return user;
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setAddress(user.getAddress());
        userDto.setContact(user.getContact());
        userDto.setRoleName(user.getRoleName());
        userDto.setDescription(user.getDescription());
        userDto.setProfilePicUrl(user.getProfilePicUrl());
        if (user.getSocialLinks() != null && !user.getSocialLinks().isEmpty()) {
            try {
                userDto.setSocialLinks(objectMapper.readValue(user.getSocialLinks(), new TypeReference<List<SocialLinks>>() {
                }));
            } catch (IOException e) {
                log.error("Error while parsing the user social links : {}", e.getMessage());
            }
        } else {
            userDto.setSocialLinks(null);
        }
        if (!user.getSkills().isEmpty()) {
            try {
                userDto.setSkills(objectMapper.readValue(user.getSkills(), new TypeReference<List<SkillPayload>>() {
                }));
            } catch (JsonProcessingException e) {
                log.error("Error whilee converting the userdto skills : {}", e.getMessage());
            }
        }
        if (!user.getEducations().isEmpty()) {
            try {
                userDto.setEducations(objectMapper.readValue(user.getEducations(), new TypeReference<List<Education>>() {
                }));
            } catch (JsonProcessingException e) {
                log.error("Error whilee converting the userdto educations : {}", e.getMessage());
            }
        }
        return userDto;
    }

    public Mono<UserDto> updateUserSocialLinks(SocialLinks socialLinks, String userId) throws Exception {
        return userRepo.findById(userId)
                .flatMap(user -> {
                    try {
                        List<SocialLinks> previousSocialLinks = new ArrayList<>();
                        if(user.getSocialLinks() != null) {
                            previousSocialLinks.addAll(objectMapper.readValue(user.getSocialLinks(), new TypeReference<List<SocialLinks>>() {
                            }));
                        }
                        previousSocialLinks.add(socialLinks);
                        String newSocialLinksJsonString = objectMapper.writeValueAsString(previousSocialLinks);
                        user.setSocialLinks(newSocialLinksJsonString);
                        return userRepo.updateSocialLink(newSocialLinksJsonString, userId)
                                .then(Mono.just(convertToDto(user)));
                    } catch (IOException e) {
                        log.error("Error while parsing the user social links : {}", e.getMessage());
                        return Mono.error(e);
                    } catch (Exception e) {
                        log.error("Error while parsing the user social links : {}", e.getMessage());
                        e.printStackTrace();
                        return Mono.error(e);
                    }
                });
    }

    public Mono<UserDto> updateUserContact(UserDto userDto, String userId) {
        return userRepo.findById(userId)
                .flatMap(user -> {
                    try {
                        user.setContact(userDto.getContact());
                        user.setEmail(userDto.getEmail());
                        return userRepo.updateUserContact(user)
                                .then(Mono.just(userDto));
                    } catch (Exception e) {
                        log.error("Error while parsing the user : {}", e.getMessage());
                        return Mono.error(e);
                    }
                });
    }
}