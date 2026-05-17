# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Three-tier inventory management app:

- **Backend** — Spring Boot 3.2 / Java 21, exposes REST API at `/api/items` (GET list, POST create). Uses Spring Data JPA with PostgreSQL. No service layer — controller calls repository directly.
- **Frontend** — Node.js/Express server on port 3000. Serves static files from `public/` and acts as a reverse proxy: all `/api/*` requests are forwarded to the backend. The `BACKEND_URL` env var controls where the backend is. In Kubernetes the frontend `BACKEND_URL` is intentionally left empty (`""`) so that the Ingress handles routing — `/api` goes to the backend service directly.
- **Database** — PostgreSQL. Schema is managed by Hibernate (`ddl-auto=update`). The only entity is `Item` (id, name, quantity).

## Local Development

**Full stack with Docker Compose:**
```bash
docker compose up --build
# Backend: http://localhost:8080/api/items
# Frontend: http://localhost:3000
# DB: localhost:5432
```

**Backend only (Maven):**
```bash
cd backend
mvn spring-boot:run
# Requires DB_HOST, DB_NAME, DB_USER, DB_PASSWORD env vars
```

**Frontend only:**
```bash
cd frontend
npm install
node server.js
```

## Building Docker Images

```bash
docker build -t backend-inventory:v1 ./backend
docker build -t frontend-inventory:v1 ./frontend
```

The backend Dockerfile is multi-stage: Maven builds the JAR, then a slim JRE image runs it.

## Kubernetes (Minikube)

Apply manifests in this order:
```bash
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-phase0.yaml
kubectl apply -f k8s/backend-deploy-phase0.yaml
kubectl apply -f k8s/frontend-deploy.yaml
kubectl apply -f k8s/ingress.yaml
```

Load locally built images into Minikube before deploying:
```bash
minikube image load backend-inventory:v1
minikube image load frontend-inventory:v1
```

All k8s manifests use `imagePullPolicy: Never` — images must be loaded into Minikube, not pulled from a registry.

The Ingress (nginx) routes `/api` → backend service (8080) and `/` → frontend service (3000).

## CI/CD (Jenkins)

The `jenkinsfile` runs on Windows agents (`bat` commands). Pipeline stages:
1. Build Docker images tagged with `BUILD_NUMBER`
2. Load images into Minikube
3. Update running deployments with `kubectl set image` and wait for rollout

Requires `DIR_PATH` parameter to be passed at pipeline trigger time.

## Key Env Vars

| Variable | Used by | Value in k8s |
|---|---|---|
| `DB_HOST` | Backend | `postgres-service` |
| `DB_NAME` | Backend | `inventory_db` |
| `DB_USER` | Backend | `user` |
| `DB_PASSWORD` | Backend | `password` |
| `BACKEND_URL` | Frontend | `""` (Ingress handles routing) |
