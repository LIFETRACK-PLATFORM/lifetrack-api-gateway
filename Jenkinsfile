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
  }

  post {
    success {
      echo "Pipeline OK - api-gateway #${env.BUILD_NUMBER}"
      githubNotify credentialsId: 'github-token-userpass', account: 'LIFETRACK-PLATFORM', repo: 'lifetrack-api-gateway', sha: env.GIT_COMMIT, status: 'SUCCESS', context: 'jenkins-ci', description: 'CI passed'
    }
    failure {
      echo "Pipeline FAILED - api-gateway #${env.BUILD_NUMBER}"
      githubNotify credentialsId: 'github-token-userpass', account: 'LIFETRACK-PLATFORM', repo: 'lifetrack-api-gateway', sha: env.GIT_COMMIT, status: 'FAILURE', context: 'jenkins-ci', description: 'CI failed'
    }
  }
}
