package com.prasannjeet.social.dto;

import static java.net.http.HttpResponse.BodySubscribers.mapping;
import static java.net.http.HttpResponse.BodySubscribers.ofByteArray;

import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodySubscriber;

import com.fasterxml.jackson.databind.ObjectMapper;

public record TwitterTokenBodyHandler(ObjectMapper mapper) implements HttpResponse.BodyHandler<TwitterToken> {

    public static TwitterTokenBodyHandler twitterTokenHandler(ObjectMapper mapper) {
        return new TwitterTokenBodyHandler(mapper);
    }

    @Override
    public BodySubscriber<TwitterToken> apply(HttpResponse.ResponseInfo responseInfo) {
        return mapping(ofByteArray(), this::apply);
    }

    private TwitterToken apply(byte[] body) {
        try {
            var responseNode = mapper.readTree(body);
            var accessTokenString = responseNode.get("access_token").asText();
            var accessTokenNode = mapper.readTree(accessTokenString);
            return new TwitterToken(
                    accessTokenNode.get("oauth_token").asText(),
                    accessTokenNode.get("oauth_token_secret").asText(),
                    accessTokenNode.get("screen_name").asText(),
                    accessTokenNode.get("user_id").asText(),
                    responseNode.get("account-link-url").asText()
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
