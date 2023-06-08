package com.prasannjeet.social.service;

import static com.prasannjeet.social.util.MessageUtil.createChatMessagesFromEntities;
import static com.prasannjeet.social.util.MessageUtil.createMessageEntityFromChatMessage;
import static com.prasannjeet.social.util.MessageUtil.createTemplateChatMessages;
import static com.prasannjeet.social.util.MessageUtil.getMessageByFromRole;
import static java.util.UUID.randomUUID;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.prasannjeet.social.conf.SocialConfig;
import com.prasannjeet.social.jpa.MessageEntity;
import com.prasannjeet.social.jpa.MessageEntityRepository;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiFlowService {

    private final SocialConfig socialConfig;
    private final MessageEntityRepository messageEntityRepository;

    public ChatCompletionResult getOpenAiResponse(String prompt, Jwt jwt) {

        String userId = jwt.getSubject();
        var service = new OpenAiService(socialConfig.getOpenAiToken());
        List<ChatMessage> chatMessages = fetchChatMessages(jwt);

        ChatMessage singletonMessage = new ChatMessage("user", prompt);
        chatMessages.add(singletonMessage);

        var request = getCompletionRequest(chatMessages, userId);
        var chatCompletion = service.createChatCompletion(request);
        var message = chatCompletion.getChoices().get(0).getMessage();

        saveMessageEntity(singletonMessage, userId);
        saveMessageEntity(message, userId);
        return chatCompletion;
    }

    public List<MessageEntity> getAllMessagesForUser(Jwt jwt) {
        Iterable<MessageEntity> allByUserId = messageEntityRepository.findAllByUserId(jwt.getSubject());
        if (allByUserId == null || !allByUserId.iterator().hasNext()) {
            return saveInitialChatMessageForUser(jwt.getSubject());
        }
        return (List<MessageEntity>) allByUserId;
    }

    @Transactional
    public void deleteAllMessagesForUser(Jwt jwt) {
        messageEntityRepository.deleteAllByUserId(jwt.getSubject());
    }

    private List<ChatMessage> fetchChatMessages(Jwt jwt) {
        Iterable<MessageEntity> allByUserId = messageEntityRepository.findAllByUserId(jwt.getSubject());
        if (allByUserId == null || !allByUserId.iterator().hasNext()) {
            log.info("No messages found for user: {}", jwt.getSubject());
            List<MessageEntity> messageEntities = saveInitialChatMessageForUser(jwt.getSubject());
            return createChatMessagesFromEntities(messageEntities);
        }
        log.info("Found {} messages for user: {}", ((List<MessageEntity>) allByUserId).size(), jwt.getSubject());
        return createChatMessagesFromEntities((List<MessageEntity>) allByUserId);
    }

    private ChatCompletionRequest getCompletionRequest(List<ChatMessage> messages, String userId) {
        return ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(messages)
                .temperature(0.4)
                .n(1)
                .stream(false)
                .maxTokens(1000)
                .user(userId)
                .build();
    }

    private List<MessageEntity> saveInitialChatMessageForUser(String userId) {
        List<ChatMessage> chatMessages = createTemplateChatMessages();
        LocalDateTime now = LocalDateTime.now();
        List<MessageEntity> messageEntities = new ArrayList<>();
        for (int i = 0; i < chatMessages.size(); i++) {
            ChatMessage chatMessage = chatMessages.get(i);
            MessageEntity messageEntity = new MessageEntity();
            messageEntity.setMessageId(randomUUID().toString());
            messageEntity.setUserId(userId);
            messageEntity.setMessageBy(getMessageByFromRole(chatMessage.getRole()));
            messageEntity.setCreatedAt(now.plusNanos(i * 1000L));
            messageEntity.setMessageText(chatMessage.getContent());
            messageEntities.add(messageEntity);
        }
        messageEntityRepository.saveAll(messageEntities);
        return messageEntities;
    }

    private void saveMessageEntity(ChatMessage chatMessage, String userId) {
        var entity = createMessageEntityFromChatMessage(chatMessage, userId);
        messageEntityRepository.save(entity);
    }
}
