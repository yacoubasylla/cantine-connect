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

# Laisse 45s au JVM/Spring pour démarrer avant de compter les échecs
HEALTHCHECK --interval=10s --timeout=5s --start-period=45s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-8081}/actuator/health" || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
