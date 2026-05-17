pipeline {
    agent any

    parameters {
        string(name: 'DIR_PATH', description: 'Project directory', defaultValue: 'c:/Users/bbbss/Desktop/Engineer/Devops/yehudit/04_26/inventory-project2')
    }

    environment {
        FRONTEND_IMAGE = "frontend-inventory:v${env.BUILD_NUMBER}"
        BACKEND_IMAGE  = "backend-inventory:v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build Docker Images') {
            steps {
                dir("${params.DIR_PATH}") {
                    echo "Building Frontend Image..."
                    bat "docker build -t %FRONTEND_IMAGE% ./frontend"

                    echo "Building Backend Image..."
                    bat "docker build -t %BACKEND_IMAGE% ./backend"
                }
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
