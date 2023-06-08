package com.prasannjeet.social.dto;

import static java.net.http.HttpResponse.BodySubscribers.mapping;
import static java.net.http.HttpResponse.BodySubscribers.ofByteArray;

import java.io.IOException;
import java.net.http.HttpResponse.BodyHandler;
import java.net.http.HttpResponse.BodySubscriber;
import java.net.http.HttpResponse.ResponseInfo;

import com.fasterxml.jackson.databind.ObjectMapper;

public record AccessRequestBodyHandler(ObjectMapper mapper) implements BodyHandler<AccessRequestDTO> {

    public static AccessRequestBodyHandler accessRequestHandler(ObjectMapper mapper) {
        return new AccessRequestBodyHandler(mapper);
    }

    @Override
    public BodySubscriber<AccessRequestDTO> apply(ResponseInfo responseInfo) {
        return mapping(ofByteArray(), body -> {
            try {
                return apply(body);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    private AccessRequestDTO apply(byte[] body) throws IOException {
        var responseNode = mapper.readTree(body);
        return new AccessRequestDTO(
                responseNode.get("id").asText(),
                responseNode.get("username").asText(),
                responseNode.get("firstName").asText(),
                responseNode.get("lastName").asText(),
                responseNode.get("email").asText()
        );
    }
}
