package com.prasannjeet.social.security.util;

import static java.security.KeyFactory.getInstance;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;

import com.prasannjeet.social.exception.JwtParsingException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

public class PublicKeyUtil {

    public static Jws<Claims> getJwsClaimsFromJwt(String jwt, String publicKey) throws JwtParsingException {

        try {
            Key rsaKey = (Key) getRsaKeyFromBytes(getBytesFromPublicKey(publicKey));
            return getJwsClaimsFromJwt(jwt, rsaKey);
        } catch (Exception e) {
            throw new JwtParsingException(e.getMessage(), e);
        }
    }

    public static Jws<Claims> getJwsClaimsFromJwt(String jwt, Key key) throws JwtParsingException {

        Jws<Claims> jws;

        try {
            jws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt);
        } catch (JwtException ex) {
            throw new JwtParsingException(ex.getMessage(), ex);
        }
        return jws;
    }

    @SuppressWarnings("unchecked")
    public static List<String> getRolesFromJwt(String jwt, String key) throws JwtParsingException {
        Jws<Claims> jws = getJwsClaimsFromJwt(jwt, key);
        return (ArrayList<String>) jws.getBody().get("realm_access", LinkedHashMap.class).get("roles");
    }

    private static byte[] getBytesFromPublicKey(String publicKey) {
        return Base64.getDecoder().decode(publicKey.getBytes(StandardCharsets.UTF_8));
    }

    private static RSAKey getRsaKeyFromBytes(byte[] bytes) throws NoSuchAlgorithmException, InvalidKeySpecException {
        return (RSAKey) getInstance("RSA").generatePublic(new X509EncodedKeySpec(bytes));
    }
}
