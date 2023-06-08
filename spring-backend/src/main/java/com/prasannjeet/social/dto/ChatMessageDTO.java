package com.prasannjeet.social.dto;

public record ChatMessageDTO(
        String author,
        String createdAt,
        String id,
        String text,
        String type
) {
}
