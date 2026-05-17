# שלב הבנייה
FROM maven:3.9-eclipse-temurin-21 AS build
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests

# שלב ההרצה
FROM eclipse-temurin:21-jdk-jammy
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]