package com.prasannjeet.social.jpa;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tweetlocations")
@Data
@NoArgsConstructor
public class LocationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String tweetId;
    private String latitude;
    private String longitude;

    public LocationEntity(String tweetId, String latitude, String longitude) {
        this.tweetId = tweetId;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
