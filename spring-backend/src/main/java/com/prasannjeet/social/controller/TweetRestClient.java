package com.prasannjeet.social.controller;

import java.io.File;
import java.net.URI;
import java.time.LocalDateTime;

import com.prasannjeet.social.dto.TweetResponse;
import com.prasannjeet.social.dto.TwitterToken;
import com.prasannjeet.social.jpa.LocationEntity;
import com.prasannjeet.social.jpa.LocationEntityRepository;
import com.prasannjeet.social.jpa.TweetEntity;
import com.prasannjeet.social.jpa.TweetEntityRepository;
import com.prasannjeet.social.service.OpenAiFlowService;
import com.prasannjeet.social.service.TokenService;
import com.prasannjeet.social.service.TweetService;
import com.prasannjeet.social.service.UploadService;
import io.github.redouane59.twitter.dto.tweet.Tweet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/twitter")
@PreAuthorize("hasRole('hastwitter')")
@Slf4j
@RequiredArgsConstructor
public class TweetRestClient {

    private final TokenService tokenService;
    private final TweetService tweetService;
    private final UploadService uploadService;
    private final TweetEntityRepository tweetEntityRepository;
    private final LocationEntityRepository locationEntityRepository;
    private final OpenAiFlowService openAiFlowService;

    @PostMapping("/tweet")
    public TweetResponse postSimpleTweet(@RequestParam("tweet") String tweetMessage, @AuthenticationPrincipal Jwt jwt) {

        try {
            String keycloakToken = jwt.getTokenValue();
            TwitterToken twitterToken = tokenService.getTwitterToken(keycloakToken);
            var tweet = this.tweetService.tweetSimple(twitterToken, tweetMessage);

            TweetEntity tweetEntity = new TweetEntity(
                    jwt.getSubject(),
                    twitterToken.twitterUserId(),
                    tweet.getId(),
                    twitterToken.name(),
                    tweet.getText(),
                    null,
                    tweet.getCreatedAt()
            );

            tweetEntityRepository.save(tweetEntity);

            String tweetLink = new URI("https://twitter.com/i/web/status/" + tweet.getId()).toString();
            String tweetId = tweet.getId();

            return new TweetResponse(tweetId, tweetLink);

        } catch (Exception e) {
            log.error("Error while posting tweet", e);
            throw new RuntimeException(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/tweet/tweet-image", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TweetResponse postTweetWithImage(@RequestParam("tweet") String tweetMessage, @RequestParam("file") MultipartFile file, @AuthenticationPrincipal Jwt jwt) {

        try {
            File image = uploadService.uploadImage(file);
            String keycloakToken = jwt.getTokenValue();
            TwitterToken twitterToken = tokenService.getTwitterToken(keycloakToken);
            var tweet = this.tweetService.tweetWithMedia(twitterToken, tweetMessage, image);

            saveTweetEntity(jwt, twitterToken, tweet, image);

            String tweetLink = new URI("https://twitter.com/i/web/status/" + tweet.getId()).toString();
            String tweetId = tweet.getId();

            return new TweetResponse(tweetId, tweetLink);

        } catch (Exception e) {
            log.error("Error while posting tweet", e);
            throw new RuntimeException(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/tweet/tweet-location", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TweetResponse postTweetWithImageWithLocation(
            @RequestParam("latitude") String latitude,
            @RequestParam("longitude") String longitude,
            @RequestParam("placeId") String placeId,
            @RequestParam("tweet") String tweetMessage,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Jwt jwt
    ) {

        try {
            File image = uploadService.uploadImage(file);
            String keycloakToken = jwt.getTokenValue();
            TwitterToken twitterToken = tokenService.getTwitterToken(keycloakToken);

            double lat = Double.parseDouble(latitude);
            double lon = Double.parseDouble(longitude);

            var tweet = this.tweetService.tweetWithMediaAndLocation(twitterToken, tweetMessage, image, placeId);

            TweetEntity savedTweet = saveTweetEntity(jwt, twitterToken, tweet, image);
            saveLocationEntity(savedTweet, lat, lon);

            String tweetLink = new URI("https://twitter.com/i/web/status/" + tweet.getId()).toString();
            String tweetId = tweet.getId();

            return new TweetResponse(tweetId, tweetLink);

        } catch (Exception e) {
            log.error("Error while posting tweet", e);
            throw new RuntimeException(e);
        }
    }

    private TweetEntity saveTweetEntity(Jwt jwt, TwitterToken twitterToken, Tweet tweet, File image) {
        TweetEntity tweetEntity = new TweetEntity(
                jwt.getSubject(),
                twitterToken.twitterUserId(),
                tweet.getId(),
                twitterToken.name(),
                tweet.getText(),
                image.getAbsolutePath(),
                LocalDateTime.now()
        );

        this.tweetEntityRepository.save(tweetEntity);

        return tweetEntity;
    }

    private void saveLocationEntity(TweetEntity tweetEntity, double lat, double lon) {
        var locationEntity = new LocationEntity(
                tweetEntity.getId(),
                Double.toString(lat),
                Double.toString(lon)
        );

        this.locationEntityRepository.save(locationEntity);
    }
}
