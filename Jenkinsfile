pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh '''
                docker-compose down -v || true
                docker-compose up -d --build
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
