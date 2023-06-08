package com.prasannjeet.social.controller;

import static com.prasannjeet.social.util.MessageUtil.convertToChatMessageDTO;
import static java.util.Comparator.comparing;

import java.util.List;

import com.prasannjeet.social.dto.ChatMessageDTO;
import com.prasannjeet.social.jpa.MessageEntity;
import com.prasannjeet.social.service.OpenAiFlowService;
import com.theokanning.openai.OpenAiHttpException;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
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
@RequestMapping("/autocomplete")
@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasRole('openapi')")
public class OpenAIController {
    private final OpenAiFlowService openAiFlowService;
    private final String assistantId;

    @CrossOrigin
    @PostMapping(value = "/completion")
    public ChatMessage getCompletion(@RequestParam("prompt") String prompt, @AuthenticationPrincipal Jwt jwt) {
        try {
            log.info("Received request for prompt: {} and user: {}", prompt, jwt.getSubject());
            ChatCompletionResult openAiResponse = openAiFlowService.getOpenAiResponse(prompt, jwt);
            ChatMessage message = openAiResponse.getChoices().get(0).getMessage();
            log.info("Returning completion: {}", message);
            return message;
        } catch (Exception e) {
            if (e instanceof OpenAiHttpException ex) {
                log.error("Error from OpenAI: {}", ex.getMessage());
            }
            throw new RuntimeException("Some problems when getting completion from OpenAI", e);
        }
    }

    @CrossOrigin
    @GetMapping(value = "/allmessages", produces = "application/json")
    public List<ChatMessageDTO> getAllMessages(@AuthenticationPrincipal Jwt jwt) {
        try {
            log.info("Sending all user messages for user {}", jwt.getSubject());
            List<MessageEntity> allByUserId = openAiFlowService.getAllMessagesForUser(jwt);
            allByUserId.sort(comparing(MessageEntity::getCreatedAt));
            //Remove first 3 messages as they are the template messages
            allByUserId.remove(0);
            allByUserId.remove(0);
            allByUserId.remove(0);
            return convertToChatMessageDTO(allByUserId, this.assistantId);
        } catch (Exception e) {
            throw new RuntimeException("Couldn't get all messages for the user " + jwt.getSubject(), e);
        }
    }

    @CrossOrigin
    @DeleteMapping(value = "/clearChat")
    public void clearChat(@AuthenticationPrincipal Jwt jwt) {
        try {
            log.info("Clearing all user messages for user {}", jwt.getSubject());
            openAiFlowService.deleteAllMessagesForUser(jwt);
        } catch (Exception e) {
            log.error("Couldn't clear chat for the user " + jwt.getSubject(), e);
            throw new RuntimeException("Couldn't clear chat for the user " + jwt.getSubject(), e);
        }
    }
}
