package com.prasannjeet.social.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageEntityRepository extends JpaRepository<MessageEntity, String> {
    //Save a Message
    MessageEntity save(MessageEntity message);

    //Get all message for a user
    Iterable<MessageEntity> findAllByUserId(String userId);

    void deleteAllByUserId(String userId);
}
