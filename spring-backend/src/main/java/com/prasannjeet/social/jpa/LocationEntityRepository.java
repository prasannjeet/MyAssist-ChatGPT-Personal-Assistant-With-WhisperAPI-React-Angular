package com.prasannjeet.social.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationEntityRepository extends JpaRepository<LocationEntity, Integer> {
    //Save a Location
    LocationEntity save(LocationEntity location);
}
