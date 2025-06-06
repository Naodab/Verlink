package com.doxan.doxan.infrastructure.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary(@Value("${CLOUDINARY_URL}") String cloudinaryUrl) {
        return new Cloudinary(cloudinaryUrl);
    }
}
