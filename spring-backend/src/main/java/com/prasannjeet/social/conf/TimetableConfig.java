package com.prasannjeet.social.conf;

import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties("timetable-config")
public class TimetableConfig {

    private static final Logger LOG = LoggerFactory.getLogger(TimetableConfig.class);
    private String keycloakPublicKey;
    private String keycloakClientId;
    private String keycloakClientSecret;
    private String keycloakScheme;
    private String keycloakAuthServer;
    private String keycloakAuthPort;
    private String keycloakRealmName;
}
