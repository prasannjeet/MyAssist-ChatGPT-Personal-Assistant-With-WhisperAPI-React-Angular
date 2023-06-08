package com.prasannjeet.social.jpa;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import com.prasannjeet.social.jpa.enums.MessageByEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
public class MessageEntity {
    @Id
    private String messageId;
    private String userId;
    @Enumerated(EnumType.STRING)
    private MessageByEnum messageBy;
    private LocalDateTime createdAt;
    @Lob
    private String messageText;

}