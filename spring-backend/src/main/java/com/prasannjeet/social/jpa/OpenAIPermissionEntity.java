package com.prasannjeet.social.jpa;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.prasannjeet.social.jpa.enums.PermissionStatusEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "openai_permissions")
@Data
@NoArgsConstructor
public class OpenAIPermissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String userId;
    @Enumerated(EnumType.STRING)
    private PermissionStatusEnum permissionStatus;

    public OpenAIPermissionEntity(String userId, PermissionStatusEnum permissionStatus) {
        this.userId = userId;
        this.permissionStatus = permissionStatus;
    }
}

