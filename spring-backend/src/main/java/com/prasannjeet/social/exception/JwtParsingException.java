package com.prasannjeet.social.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JwtParsingException extends Exception {

    private static final Logger LOG = LoggerFactory.getLogger(JwtParsingException.class);

    public JwtParsingException(String message) {
        super(message);
    }

    public JwtParsingException(String message, Throwable cause) {
        super(message, cause);
        LOG.error("An error occurred while parsing the JWT. Either the token is expired, or the public key is not valid.", cause);
    }
}

