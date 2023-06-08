package com.prasannjeet.social.util;

import static com.prasannjeet.social.jpa.enums.MessageByEnum.ASSISTANT;
import static com.prasannjeet.social.jpa.enums.MessageByEnum.SYSTEM;
import static com.prasannjeet.social.jpa.enums.MessageByEnum.USER;
import static java.lang.String.valueOf;
import static java.time.LocalDateTime.now;
import static java.time.ZoneOffset.UTC;
import static java.util.UUID.randomUUID;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

import com.prasannjeet.social.dto.ChatMessageDTO;
import com.prasannjeet.social.jpa.MessageEntity;
import com.prasannjeet.social.jpa.enums.MessageByEnum;
import com.theokanning.openai.completion.chat.ChatMessage;

public class MessageUtil {
    public static List<ChatMessage> createChatMessagesFromEntities(List<MessageEntity> messageEntities) {
        // Sort messageEntities by createdAt increasing
        messageEntities.sort(Comparator.comparing(MessageEntity::getCreatedAt));
        List<ChatMessage> messages = new ArrayList<>();
        for (MessageEntity messageEntity : messageEntities) {
            String role = getRoleFromMessageBy(messageEntity.getMessageBy());
            ChatMessage chatMessage = new ChatMessage(role, messageEntity.getMessageText());
            messages.add(chatMessage);
        }
        return messages;
    }

    public static List<ChatMessage> createTemplateChatMessages() {
        return Stream.of(
                new ChatMessage("system", "You are a helpful assistant"),
                new ChatMessage("user", "Who won the world series in 2020"),
                new ChatMessage("assistant", "The Los Angeles Dodgers won the World Series in 2020.")
        ).collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    public static MessageEntity createMessageEntityFromChatMessage(ChatMessage chatMessage, String userId) {
        MessageEntity messageEntity = new MessageEntity();
        messageEntity.setMessageId(randomUUID().toString());
        messageEntity.setMessageText(chatMessage.getContent());
        messageEntity.setMessageBy(getMessageByFromRole(chatMessage.getRole()));
        messageEntity.setUserId(userId);
        messageEntity.setCreatedAt(now());
        return messageEntity;
    }

    public static MessageByEnum getMessageByFromRole(String role) {
        return switch (role) {
            case "assistant" -> ASSISTANT;
            case "system" -> SYSTEM;
            default -> USER;
        };
    }

    public static String getRoleFromMessageBy(MessageByEnum messageBy) {
        return switch (messageBy) {
            case ASSISTANT -> "assistant";
            case SYSTEM -> "system";
            default -> "user";
        };
    }

    public static List<ChatMessageDTO> convertToChatMessageDTO(List<MessageEntity> messageEntities, String assistantId) {
        List<ChatMessageDTO> chatMessageDTOS = new ArrayList<>();
        for (MessageEntity messageEntity : messageEntities) {
            ChatMessageDTO chatMessageDTO = new ChatMessageDTO(
                    messageEntity.getMessageBy() == ASSISTANT ? assistantId : messageEntity.getUserId(),
                    getEpochTime(messageEntity.getCreatedAt()),
                    messageEntity.getMessageId(),
                    messageEntity.getMessageText(),
                    "text"
            );
            chatMessageDTOS.add(chatMessageDTO);
        }
        return chatMessageDTOS;
    }

    public static String getEpochTime(LocalDateTime localDateTime) {
        return valueOf(localDateTime.toInstant(UTC).toEpochMilli());
    }

}
