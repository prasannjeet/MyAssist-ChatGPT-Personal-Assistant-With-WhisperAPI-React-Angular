package com.prasannjeet.social.security;

import static org.springframework.http.HttpMethod.GET;

import com.prasannjeet.social.security.util.KeycloakRoleConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
@EnableWebSecurity
public class OAuth2LoginSecurityConfig {

    private static final Logger LOG = LoggerFactory.getLogger(OAuth2LoginSecurityConfig.class);

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        LOG.info("Using custom HTTP Security filter chain. ");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

        http.authorizeHttpRequests(authorize -> {
                    authorize.antMatchers(GET, "/twitter");
                    authorize.anyRequest().authenticated();
                })
                .cors().and()
                .oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(jwtAuthenticationConverter);

        return http.build();
    }
}

// .hasRole("profile") and .hasAuthority("SCOPE_profile") are equivalent.
// .hasAnyRole("x", "y") can be used for multiple roles.
