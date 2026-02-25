FROM docker.io/cimg/android:2025.04.1-ndk

ENV NDK_HOME="${ANDROID_HOME}/ndk/29.0.13113456"

USER root

# install tauri prereqs
# For list of prereqs see: https://v2.tauri.app/start/prerequisites/#linux
RUN set -eux; \
  apt update; \
  apt install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# install nodejs
RUN set -eux; \
  curl -fsSL -o nodesource_setup.sh https://deb.nodesource.com/setup_24.x; \
  bash nodesource_setup.sh; \
  rm nodesource_setup.sh; \
  apt install -y nodejs

USER circleci

# install rust
RUN set -eux; \
  curl --proto '=https' --tlsv1.2 -sSf -o rustup_installer.sh https://sh.rustup.rs; \
  sh rustup_installer.sh -y --default-toolchain 1.93.1-x86_64-unknown-linux-gnu; \
  rm rustup_installer.sh

# install android target (required for building windows executable)
RUN set -eux; \
  . "$HOME/.cargo/env"; \
  rustup target add \
    aarch64-linux-android \
    armv7-linux-androideabi \
    i686-linux-android \
    x86_64-linux-android

# install build scripts
ENV PATH="/home/circleci/.local/bin/:$PATH"
COPY --chmod=755 src/etc/ /home/circleci/.local/etc/
COPY --chmod=755 src/bin/ /home/circleci/.local/bin/
