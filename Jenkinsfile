pipeline {
  agent any

  stages {
    stage('Build Builder Image') {
      steps {
        sh './build -b builder-image'
      }
    }
    stage('Build Android Builder Image') {
      steps {
        sh './build -b builder-image-android'
      }
    }
    stage('Build Linux') {
      steps {
        sh './build -b linux'
      }
    }
    stage('Build Windows') {
      steps {
        sh './build -b windows'
      }
    }
    stage('Build Android') {
        steps {
            withCredentials([
              file(credentialsId: 'australis-keystore', variable: 'KEYSTORE'),
              string(credentialsId: 'australis-keystore-alias', variable: 'KEYSTORE_ALIAS'),
              string(credentialsId: 'australis-keystore-password', variable: 'KEYSTORE_PASSWORD')
            ]) {
                sh './build -b apk -k "$KEYSTORE" -a "$KEYSTORE_ALIAS" -p "$KEYSTORE_PASSWORD"'
            }
        }
    }
    stage('Archive Artifacts') {
      steps {
        archiveArtifacts(
          artifacts: 'src-tauri/target/release/bundle/appimage/*.AppImage, src-tauri/target/release/bundle/deb/*.deb, src-tauri/target/release/bundle/rpm/*.rpm, src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/*.exe, src-tauri/gen/android/app/build/outputs/apk/universal/release/*.apk',
          fingerprint: true,
          followSymlinks: false,
          onlyIfSuccessful: true
        )
      }
    }
  }
  post {
    always {
      cleanWs(
        cleanWhenNotBuilt: false,
        deleteDirs: true,
        disableDeferredWipeout: true,
        notFailBuild: true,
      )
    }
  }
}
