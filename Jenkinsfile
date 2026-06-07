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
                sh "docker build -t ${FRONTEND_IMAGE} ./frontend"

                echo "Building Backend Image..."
                sh "docker build -t ${BACKEND_IMAGE} ./backend"
            }
        }

                stage('Push Images to ECR') {
            steps {
                echo "Logging in to ECR..."
                sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 688035105164.dkr.ecr.us-east-1.amazonaws.com"

                echo "Pushing Frontend Image..."
                sh "docker tag ${FRONTEND_IMAGE} 688035105164.dkr.ecr.us-east-1.amazonaws.com/${FRONTEND_IMAGE}"
                sh "docker push 688035105164.dkr.ecr.us-east-1.amazonaws.com/${FRONTEND_IMAGE}"

                echo "Pushing Backend Image..."
                sh "docker tag ${BACKEND_IMAGE} 688035105164.dkr.ecr.us-east-1.amazonaws.com/${BACKEND_IMAGE}"
                sh "docker push 688035105164.dkr.ecr.us-east-1.amazonaws.com/${BACKEND_IMAGE}"
            }
        }

        stage('Update Deploy to Kubernetes') {
            steps {
                echo "Updating Frontend Deployment..."
                sh "kubectl set image deployment/inventory-frontend-app frontend-app=688035105164.dkr.ecr.us-east-1.amazonaws.com/${FRONTEND_IMAGE}"

                echo "Updating Backend Deployment..."
                sh "kubectl set image deployment/inventory-backend java-app=688035105164.dkr.ecr.us-east-1.amazonaws.com/${BACKEND_IMAGE}"

                echo "Waiting for Frontend Rollout..."
                sh "kubectl rollout status deployment/inventory-frontend-app --timeout=120s"

                echo "Waiting for Backend Rollout..."
                sh "kubectl rollout status deployment/inventory-backend --timeout=120s"
            }
        }
    }
}
