package com.prasannjeet.social.controller;

import java.util.List;

import com.nimbusds.jose.shaded.json.JSONArray;
import com.nimbusds.jose.shaded.json.JSONObject;
import com.prasannjeet.social.dto.AccessRequestDTO;
import com.prasannjeet.social.jpa.OpenAIPermissionEntity;
import com.prasannjeet.social.jpa.OpenAIPermissionEntityRepository;
import com.prasannjeet.social.jpa.enums.PermissionStatusEnum;
import com.prasannjeet.social.service.RoleAssignmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roles")
@Slf4j
@RequiredArgsConstructor
public class RolesController {
    private final OpenAIPermissionEntityRepository permissionRepo;
    private final RoleAssignmentService roleAssignmentService;

    @CrossOrigin
    @GetMapping(value = "/all", produces = "application/json")
    @PreAuthorize("hasRole('role-assigner')")
    public List<AccessRequestDTO> getAllPermissions() {
        try {
            List<OpenAIPermissionEntity> allPermissions = permissionRepo.findAll();
            return allPermissions.stream().map(p -> {
                AccessRequestDTO requestInfo = null;
                try {
                    requestInfo = roleAssignmentService.getRequestInfo(p.getUserId());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                requestInfo.setStatus(p.getPermissionStatus().name());
                return requestInfo;
            }).toList();
        } catch (Exception e) {
            log.error("Couldn't get all permissions", e);
            throw new RuntimeException(e);
        }
    }

    @CrossOrigin
    @PostMapping(value = "/assign")
    @PreAuthorize("hasRole('role-assigner')")
    public void assignRole(@RequestParam("userId") String userId) {
        try {
            log.info("Received request to assign role openapi to user {}", userId);
            OpenAIPermissionEntity permissionEntity = permissionRepo.findOpenAIPermissionEntityByUserId(userId);
            if (permissionEntity == null) {
                log.error("No permission request found for user {}", userId);
                throw new RuntimeException("No permission request found for user " + userId);
            }
            roleAssignmentService.addOpenAiRoleToUser(userId);
            permissionEntity.setPermissionStatus(convertStringToPermission("approved"));
            permissionRepo.save(permissionEntity);
        } catch (Exception e) {
            log.error("Couldn't assign role to user {}", userId, e);
            throw new RuntimeException("Couldn't assign role to user", e);
        }
    }

    @CrossOrigin
    @DeleteMapping(value = "/assign")
    @PreAuthorize("hasRole('role-assigner')")
    public void revokeRole(@RequestParam("userId") String userId) {
        try {
            log.info("Received request to revoke role openapi to user {}", userId);
            OpenAIPermissionEntity permissionEntity = permissionRepo.findOpenAIPermissionEntityByUserId(userId);
            if (permissionEntity == null) {
                permissionEntity = new OpenAIPermissionEntity(userId, PermissionStatusEnum.REJECTED);
            }
            roleAssignmentService.revokeOpenAiRoleToUser(userId);
            permissionEntity.setPermissionStatus(convertStringToPermission("rejected"));
            permissionRepo.save(permissionEntity);
        } catch (Exception e) {
            log.error("Couldn't assign role to user {}", userId, e);
            throw new RuntimeException("Couldn't assign role to user", e);
        }
    }

    @CrossOrigin
    @PostMapping(value = "/request")
    public void requestRole(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        try {
            log.info("Received request to assign openapi to user {}", userId);
            OpenAIPermissionEntity permissionEntity = permissionRepo.findOpenAIPermissionEntityByUserId(userId);
            if (permissionEntity != null) {
                log.error("Request already registered for user {}", userId);
                throw new RuntimeException("Request already registered for user " + userId);
            }
            OpenAIPermissionEntity newPermissionEntity = new OpenAIPermissionEntity(userId, PermissionStatusEnum.PENDING);
            permissionRepo.save(newPermissionEntity);
        } catch (RuntimeException e) {
            log.error("Encountered some issue in adding a request for openai role for user {}.", userId, e);
            throw new RuntimeException("Encountered some issue in adding a request for openai role.", e);
        }
    }

    @CrossOrigin
    @GetMapping(value = "/status")
    public String getPermissionStatus(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        try {
            log.info("Received request to get permission status for user {}", userId);
            OpenAIPermissionEntity permissionEntity = permissionRepo.findOpenAIPermissionEntityByUserId(userId);
            if (permissionEntity == null || permissionEntity.getPermissionStatus() == null) {
                if (hasOpenAiRole(jwt)) {
                    return PermissionStatusEnum.APPROVED.toString();
                }
                return "NOT_REQUESTED";
            }
            return permissionEntity.getPermissionStatus().toString();
        } catch (Exception e) {
            log.error("Encountered some issue in getting permission status for user {}.", userId, e);
            throw new RuntimeException("Encountered some issue in getting permission status.", e);
        }
    }

    private boolean hasOpenAiRole(Jwt jwt) {
        Object realmAccess = jwt.getClaim("realm_access");
        JSONObject jsonObject = (JSONObject) realmAccess;
        JSONArray roles = (JSONArray) jsonObject.get("roles");
        List<String> rolesList = roles.stream().map(String.class::cast)
                .toList();
        return rolesList.contains("openapi");
    }

    private PermissionStatusEnum convertStringToPermission(String permission) {
        return switch (permission) {
            case "pending" -> PermissionStatusEnum.PENDING;
            case "approved" -> PermissionStatusEnum.APPROVED;
            default -> PermissionStatusEnum.REJECTED;
        };
    }
}
