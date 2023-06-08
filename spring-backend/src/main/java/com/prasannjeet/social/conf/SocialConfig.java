package com.prasannjeet.social.conf;

import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("social-config")
public class SocialConfig {

    private static final Logger LOG = LoggerFactory.getLogger(SocialConfig.class);

    private String apiKey;
    private String apiSecret;
    private String myAccessToken;
    private String myAccessSecret;
    private String bearerToken;
    private String clientId;
    private String clientSecret;
    private String localUploadPath;
    private String openAiToken;
    private String adminClientId;
    private String adminClientSecret;
    private String openAiRoleName;
    private String openAiRoleId;


    @Bean
    public String assistantId() {
        return "06c33e8b-e835-4736-80f4-63f44b66666d";
    }

}
