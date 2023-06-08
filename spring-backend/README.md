# SocialFLow Backend Service
Backend service for SocialFlow application.

Important Functionalities:

1. User Authentication
2. User Authorization
3. Post image to Twitter and get Image ID
4. Post a Tweet with Image and Location to Twitter and get Tweet ID
5. Post a Tweet with Image to Twitter and get Tweet ID
6. Post a simple Tweet to Twitter and get Tweet ID
7. Save image to NFS storage.
8. Save Tweet to MariaDB
9. Save Location to MariaDB

## Some important commands
To install Openssl, add the following in Dockerfile:
```dockerfile
# Install openssl
RUN yum install -y openssl
```

Set of commands to import a certificate in keystore in Java:
```shell
# Change the original password of the default keystore
keytool -storepasswd -new changeThisPass -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit

# Create a directory to import the certificate
mkdir -p usr/app/ssl/certs/

# Create a new keystore here
keytool -genkeypair -keyalg RSA -keysize 2048 -validity 10000 -storetype PKCS12 \
    -keystore key-cert-prasannjeet.p12 -alias pjkeystore \
    -dname "cn=com.prasannjeet, ou=Timetable, o=Prasannjeet, c=SE" \
    -storepass changeThisPass -keypass changeThisPass
    
# Now the pem certificate file must be copied here
COPY certs/keycloak.local.pem usr/app/ssl/certs/keycloak.local.pem

# Now import this certificate in the keystore just created
keytool -import -v -trustcacerts -alias keycloak2 -file keycloak.local.pem \
    -keystore key-cert-prasannjeet.p12 -storepass changeThisPass -noprompt
    
# Finally, import the keystore in the Java keystore
keytool -importkeystore -srckeystore /usr/app/ssl/certs/key-cert-prasannjeet.p12 \
    -destkeystore $JAVA_HOME/lib/security/cacerts -srcstorepass changeThisPass \
    -deststorepass changeThisPass -noprompt
```

In the application.yml, this part can also be set. Although `issuer-uri' is generally enough.`
```yml
jwk-set-uri: ${KEYCLOAK_AUTH_SERVER}:${KEYCLOAK_AUTH_PORT}/realms/${REALM_NAME}/protocol/openid-connect/certs
```