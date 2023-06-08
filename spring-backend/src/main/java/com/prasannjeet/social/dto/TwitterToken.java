package com.prasannjeet.social.dto;

public record TwitterToken(
        String oauthToken,
        String oauthTokenSecret,
        String name,
        String twitterUserId,
        String accountLinkUrl
) {
}
