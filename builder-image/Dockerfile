FROM docker.io/ubuntu:24.04

# install tauri prereqs
# For list of prereqs see: https://v2.tauri.app/start/prerequisites/#linux
# Some version numbers are pinned due to an issue with appimages not being
# truly portable. For more information see the following links:
# - https://github.com/tauri-apps/tauri/pull/12491
# - https://github.com/audioling/audioling/issues/40#issuecomment-2908048836
# - https://github.com/OmniKee/OmniKee/blob/main/.github/workflows/release.yml#L108C1-L113C42
RUN set -eux; \
  apt-get update; \
  apt-get install -y \
    libwebkit2gtk-4.1-0=2.44.0-2 \
    libwebkit2gtk-4.1-dev=2.44.0-2 \
    libjavascriptcoregtk-4.1-0=2.44.0-2 \
    libjavascriptcoregtk-4.1-dev=2.44.0-2 \
    gir1.2-javascriptcoregtk-4.1=2.44.0-2 \
    gir1.2-webkit2-4.1=2.44.0-2 \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    xdg-utils

# install nodejs
RUN set -eux; \
  curl -fsSL -o nodesource_setup.sh https://deb.nodesource.com/setup_20.x; \
  bash nodesource_setup.sh; \
  rm nodesource_setup.sh; \
  apt-get install -y nodejs

# install llvm (required for building windows executable)
RUN set -eux; \
  apt-get install -y nsis lld llvm lsb-release wget software-properties-common gnupg; \
  curl -o llvm.sh https://apt.llvm.org/llvm.sh; \
  bash llvm.sh 20 all; \
  rm llvm.sh
ENV PATH="/usr/lib/llvm-20/bin/:$PATH"

# create non-root user
RUN useradd --create-home builder
USER builder
WORKDIR /home/builder
ENV PATH="/home/builder/.local/bin/:$PATH"

# install rust
RUN set -eux; \
  curl --proto '=https' --tlsv1.2 -sSf -o rustup_installer.sh https://sh.rustup.rs; \
  sh rustup_installer.sh -y --default-toolchain 1.89.0-x86_64-unknown-linux-gnu; \
  rm rustup_installer.sh

# install windows target (required for building windows executable)
RUN set -eux; \
  . "$HOME/.cargo/env"; \
  rustup target add \
    x86_64-pc-windows-msvc; \
  cargo install --locked cargo-xwin@0.18.6

# install build scripts
COPY --chmod=755 src/bin/build_linux src/bin/build_windows /home/builder/.local/bin/

RUN mkdir /home/builder/project
WORKDIR /home/builder/project
