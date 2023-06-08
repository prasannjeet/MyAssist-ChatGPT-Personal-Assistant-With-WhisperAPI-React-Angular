package com.prasannjeet.social.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TweetEntityRepository extends JpaRepository<TweetEntity, String> {
    //Save a Tweet
    TweetEntity save(TweetEntity tweet);
}
