package com.prasannjeet.social.service;

import static com.prasannjeet.social.dto.AccessRequestBodyHandler.accessRequestHandler;
import static com.prasannjeet.social.dto.AccessTokenBodyHandler.accessTokenHandler;
import static java.net.http.HttpClient.newHttpClient;
import static java.net.http.HttpRequest.BodyPublishers.ofString;
import static java.net.http.HttpRequest.newBuilder;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandler;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prasannjeet.social.conf.SocialConfig;
import com.prasannjeet.social.conf.TimetableConfig;
import com.prasannjeet.social.dto.AccessRequestDTO;
import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleAssignmentService {

    private final SocialConfig socialConfig;
    private final TimetableConfig timetableConfig;

    public void addOpenAiRoleToUser(String userId) throws URISyntaxException, IOException, InterruptedException {

        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> jsonData = Map.of(
                "id", socialConfig.getOpenAiRoleId(),
                "name", socialConfig.getOpenAiRoleName()
        );
        List<Map<String, String>> finalData = List.of(jsonData);

        URI uri = new URIBuilder()
                .setScheme(timetableConfig.getKeycloakScheme())
                .setHost(timetableConfig.getKeycloakAuthServer())
                .setPort(Integer.parseInt(timetableConfig.getKeycloakAuthPort()))
                .setPath("/admin/realms/" + timetableConfig.getKeycloakRealmName() + "/users/" + userId + "/role-mappings/realm")
                .build();

        HttpClient client = newHttpClient();

        HttpRequest request = newBuilder()
                .uri(uri)
                .header("Content-Type", "application/json")
                .headers("Authorization", "Bearer " + getAdminToken())
                .POST(ofString(mapper.writeValueAsString(finalData)))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 204) {
            throw new RuntimeException("Failed to add role to user");
        }
    }

    public void revokeOpenAiRoleToUser(String userId) throws IOException, URISyntaxException, InterruptedException {
        URI uri = new URIBuilder()
                .setScheme(timetableConfig.getKeycloakScheme())
                .setHost(timetableConfig.getKeycloakAuthServer())
                .setPort(Integer.parseInt(timetableConfig.getKeycloakAuthPort()))
                .setPath("/admin/realms/" + timetableConfig.getKeycloakRealmName() + "/users/" + userId + "/role-mappings/realm")
                .build();
        OkHttpClient client = new OkHttpClient().newBuilder()
                .build();
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "[{\"id\":\"" + socialConfig.getOpenAiRoleId() + "\",\"name\":\"" + socialConfig.getOpenAiRoleName() + "\",\"composite\":true}]");
        Request request = new Request.Builder()
                .url(uri.toURL())
                .method("DELETE", body)
                .addHeader("Authorization", "Bearer " + getAdminToken())
                .addHeader("Content-Type", "application/json")
                .build();
        client.newCall(request).execute();
    }

    public AccessRequestDTO getRequestInfo(String userId) throws URISyntaxException, IOException, InterruptedException {
        ObjectMapper mapper = new ObjectMapper();

        URI uri = new URIBuilder()
                .setScheme(timetableConfig.getKeycloakScheme())
                .setHost(timetableConfig.getKeycloakAuthServer())
                .setPort(Integer.parseInt(timetableConfig.getKeycloakAuthPort()))
                .setPath("/admin/realms/" + timetableConfig.getKeycloakRealmName() + "/users/" + userId)
                .build();

        HttpClient client = newHttpClient();

        HttpRequest request = newBuilder()
                .uri(uri)
                .header("Content-Type", "application/json")
                .headers("Authorization", "Bearer " + getAdminToken())
                .GET()
                .build();

        HttpResponse<AccessRequestDTO> response = client.send(request, accessRequestHandler(mapper));
        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to add role to user");
        }
        return response.body();
    }

    private String getAdminToken() throws URISyntaxException, IOException, InterruptedException {
        ObjectMapper mapper = new ObjectMapper();

        Map<String, String> dataParams = Map.of(
                "client_id", socialConfig.getAdminClientId(),
                "client_secret", socialConfig.getAdminClientSecret(),
                "grant_type", "client_credentials"
        );

        String form = dataParams.entrySet().stream()
                .map(e -> {
                    return e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8);
                })
                .reduce((a, b) -> a + "&" + b).get();

        URI uri = new URIBuilder()
                .setScheme(timetableConfig.getKeycloakScheme())
                .setHost(timetableConfig.getKeycloakAuthServer())
                .setPort(Integer.parseInt(timetableConfig.getKeycloakAuthPort()))
                .setPath("/realms/master/protocol/openid-connect/token")
                .build();

        HttpClient client = newHttpClient();

        HttpRequest request = newBuilder()
                .uri(uri)
                .headers("Content-Type", "application/x-www-form-urlencoded")
                .POST(ofString(form))
                .build();

        BodyHandler<String> responseBodyHandler = accessTokenHandler(mapper);

        return client.send(request, responseBodyHandler).body();
    }
}
