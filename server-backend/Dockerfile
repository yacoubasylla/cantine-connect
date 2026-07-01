# ── Stage 1 : Build ──────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:resolve -q --no-transfer-progress

COPY src ./src
RUN ./mvnw clean package -DskipTests -q --no-transfer-progress

# ── Stage 2 : Runtime ────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8081

# Spring Boot lit SPRING_PROFILES_ACTIVE depuis l'environnement Railway automatiquement
# Shell form pour permettre l'expansion de $PORT par le shell
ENTRYPOINT ["java", "-jar", "app.jar"]
