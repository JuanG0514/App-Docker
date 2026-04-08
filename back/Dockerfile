# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom primero para aprovechar cache de capas
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

# curl para el healthcheck
RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 3000

# Healthcheck: espera a que Spring Boot levante antes de marcar el contenedor como healthy
HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=5 \
  CMD curl -f http://localhost:3000/productos || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
