FROM prasannjeet/timetable-base:2.0.0

ENV JAVA_MAX_MEM=1024m \
    JAVA_MAX_PERM_MEM=128m \
    SERVICE_8080_NAME=@project.artifactId@ \
    TZ=Europe/Stockholm

COPY application.yml ${APP_FOLDER}/
COPY @project.artifactId@-@project.version@.jar ${APP_FOLDER}/app.jar

# Path to upload images. Update Env Variable too.
RUN mkdir /media/uploads/

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005",  "-jar", "app.jar"]

EXPOSE 8080 8443 5005