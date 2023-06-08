package com.prasannjeet.social.service;

import java.io.File;
import java.io.FileOutputStream;

import com.prasannjeet.social.conf.SocialConfig;
import com.prasannjeet.social.exception.LocalImageUploadException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class UploadService {

    private final SocialConfig socialConfig;

    public UploadService(SocialConfig socialConfig) {
        this.socialConfig = socialConfig;
    }

    public File uploadImage(MultipartFile file) {
        try {
            File path = new File(socialConfig.getLocalUploadPath() + file.getOriginalFilename());

            //Recursively check if file already exists, then append a number to the end of the file name
            int i = 1;
            while (path.exists()) {
                String fileName = file.getOriginalFilename();
                String extension = fileName.substring(fileName.lastIndexOf("."));
                String name = fileName.substring(0, fileName.lastIndexOf("."));
                path = new File(socialConfig.getLocalUploadPath() + name + i + extension);
                i++;
            }

            path.createNewFile();
            FileOutputStream output = new FileOutputStream(path);
            output.write(file.getBytes());
            output.close();
            log.info("File {} uploaded successfully", file.getOriginalFilename());
            return path;
        } catch (Exception e) {
            throw new LocalImageUploadException("Failed to upload file" + file.getOriginalFilename() + "to server.", e);
        }
    }

}
