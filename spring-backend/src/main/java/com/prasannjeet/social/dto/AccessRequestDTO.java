package com.prasannjeet.social.dto;

import lombok.Data;

@Data
public final class AccessRequestDTO {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String status;

    public AccessRequestDTO(String id, String username, String firstName, String lastName, String email) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
