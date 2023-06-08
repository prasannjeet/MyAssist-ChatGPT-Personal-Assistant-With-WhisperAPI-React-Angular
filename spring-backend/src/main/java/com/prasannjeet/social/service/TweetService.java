package com.prasannjeet.social.service;

import static io.github.redouane59.twitter.dto.tweet.MediaCategory.TWEET_IMAGE;

import java.io.File;
import java.util.List;

import com.prasannjeet.social.conf.SocialConfig;
import com.prasannjeet.social.dto.TwitterToken;
import io.github.redouane59.twitter.TwitterClient;
import io.github.redouane59.twitter.dto.tweet.Geo;
import io.github.redouane59.twitter.dto.tweet.Tweet;
import io.github.redouane59.twitter.dto.tweet.TweetParameters;
import io.github.redouane59.twitter.dto.tweet.TweetParameters.Media;
import io.github.redouane59.twitter.dto.tweet.UploadMediaResponse;
import io.github.redouane59.twitter.signature.TwitterCredentials;
import org.springframework.stereotype.Service;

@Service
public class TweetService {

    private final SocialConfig socialConfig;

    public TweetService(SocialConfig socialConfig) {
        this.socialConfig = socialConfig;
    }

    public Tweet tweetSimple(TwitterToken token, String tweetMessage) {
        TwitterClient twitterClient = getTwitterClient(token);
        return twitterClient.postTweet(tweetMessage);
    }

    public Tweet tweetWithMedia(TwitterToken token, String tweetMessage, File image) {
        TwitterClient twitterClient = getTwitterClient(token);
        Media media = uploadMedia(twitterClient, image);

        TweetParameters tweetParameters = TweetParameters.builder()
                .media(media)
                .text(tweetMessage)
                .build();

        return twitterClient.postTweet(tweetParameters);
    }

    public Tweet tweetWithMediaAndLocation(TwitterToken token, String tweetMessage, File image, String placeId) {
        TwitterClient twitterClient = getTwitterClient(token);
        Media media = uploadMedia(twitterClient, image);

        TweetParameters tweetParameters = TweetParameters.builder()
                .media(media)
                .text(tweetMessage)
                .geo(Geo.builder().placeId(placeId).build())
                .build();

        return twitterClient.postTweet(tweetParameters);
    }

    private Media uploadMedia(TwitterClient twitterClient, File image) {
        UploadMediaResponse uploadMediaResponse = twitterClient.uploadMedia(image, TWEET_IMAGE);
        return Media.builder()
                .mediaIds(List.of(uploadMediaResponse.getMediaId()))
                .build();
    }

    private TwitterClient getTwitterClient(TwitterToken token) {
        return new TwitterClient(TwitterCredentials.builder()
                .accessToken(token.oauthToken())
                .accessTokenSecret(token.oauthTokenSecret())
                .apiKey(socialConfig.getApiKey())
                .apiSecretKey(socialConfig.getApiSecret())
                .build());
    }

}
