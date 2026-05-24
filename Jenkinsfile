pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        FRONTEND_IMAGE = "frontend-inventory:v${env.BUILD_NUMBER}"
        BACKEND_IMAGE  = "backend-inventory:v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build Docker Images') {
            steps {
                echo "Building Frontend Image..."
                bat "docker build -t %FRONTEND_IMAGE% ./frontend"

                echo "Building Backend Image..."
                bat "docker build -t %BACKEND_IMAGE% ./backend"
            }
        }

                stage('push images to ECR') {
            steps {
                echo "push images to ECR Frontend Image..."
                bat "docker tag %FRONTEND_IMAGE% 688035105164.dkr.ecr.us-east-1.amazonaws.com/%FRONTEND_IMAGE%"
                bat "docker push 688035105164.dkr.ecr.us-east-1.amazonaws.com/%FRONTEND_IMAGE%"

                echo "push images to ECR Backend Image..."
                bat "docker tag %BACKEND_IMAGE% 688035105164.dkr.ecr.us-east-1.amazonaws.com/%BACKEND_IMAGE%"
                bat "docker push 688035105164.dkr.ecr.us-east-1.amazonaws.com/%BACKEND_IMAGE%"
            }
        }

        stage('Load Images to Minikube') {
            steps {
                echo "Loading Frontend Image to Minikube..."
                bat "minikube image load %FRONTEND_IMAGE%"

                echo "Loading Backend Image to Minikube..."
                bat "minikube image load %BACKEND_IMAGE%"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Updating Frontend Deployment..."
                bat "kubectl set image deployment/inventory-frontend-app frontend-app=%FRONTEND_IMAGE%"

                echo "Updating Backend Deployment..."
                bat "kubectl set image deployment/inventory-backend java-app=%BACKEND_IMAGE%"

                echo "Waiting for Frontend Rollout..."
                bat "kubectl rollout status deployment/inventory-frontend-app --timeout=120s"

                echo "Waiting for Backend Rollout..."
                bat "kubectl rollout status deployment/inventory-backend --timeout=120s"
            }
        }
    }
}
