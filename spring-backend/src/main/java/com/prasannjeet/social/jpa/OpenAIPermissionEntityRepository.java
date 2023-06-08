package com.prasannjeet.social.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OpenAIPermissionEntityRepository extends JpaRepository<OpenAIPermissionEntity, Integer> {
    //Save a PermissionRequest
    OpenAIPermissionEntity save(OpenAIPermissionEntity permissionRequest);

    //Fetch one permission request by id
    OpenAIPermissionEntity findOpenAIPermissionEntityByUserId(String userId);

    //Fetch all permission requests
    List<OpenAIPermissionEntity> findAll();
}
