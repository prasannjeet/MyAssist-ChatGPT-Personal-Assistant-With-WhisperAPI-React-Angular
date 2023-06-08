package com.prasannjeet.social.dto;

import static java.net.http.HttpResponse.BodySubscribers.mapping;
import static java.net.http.HttpResponse.BodySubscribers.ofByteArray;

import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandler;
import java.net.http.HttpResponse.BodySubscriber;

import com.fasterxml.jackson.databind.ObjectMapper;

public record AccessTokenBodyHandler(ObjectMapper mapper) implements BodyHandler<String> {

    public static AccessTokenBodyHandler accessTokenHandler(ObjectMapper mapper) {
        return new AccessTokenBodyHandler(mapper);
    }

    @Override
    public BodySubscriber<String> apply(HttpResponse.ResponseInfo responseInfo) {
        return mapping(ofByteArray(), this::apply);
    }

    private String apply(byte[] body) {
        try {
            var responseNode = mapper.readTree(body);
            return responseNode.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
