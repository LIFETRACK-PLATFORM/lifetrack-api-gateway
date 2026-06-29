pipeline {
  agent any

  tools {
    nodejs "NodeJS-20"
  }

  stages {
    stage("Install") {
      steps {
        sh "npm install -g pnpm@10.21.0"
        sh "pnpm install --frozen-lockfile"
      }
    }

    stage("Lint") {
      steps {
        sh "pnpm run lint"
      }
    }

    stage("Test") {
      steps {
        sh "pnpm run test:cov"
      }
    }

    stage("Build") {
      steps {
        sh "pnpm run build"
      }
    }

    stage("Docker Build") {
      steps {
        sh "docker build -t api-gateway:${env.BUILD_NUMBER} ."
      }
    }

    stage("Deploy") {
      steps {
        sh "docker network create lifetrack-net || true"
        sh "docker stop api-gateway || true"
        sh "docker rm api-gateway || true"
        sh """
          docker run -d --name api-gateway \
            --network lifetrack-net \
            --restart unless-stopped \
            -p 3000:3000 \
            api-gateway:${env.BUILD_NUMBER}
        """
      }
    }
  }

  post {
    success {
      echo "Pipeline OK - api-gateway #${env.BUILD_NUMBER}"
    }
    failure {
      echo "Pipeline FAILED - api-gateway #${env.BUILD_NUMBER}"
    }
  }
}
