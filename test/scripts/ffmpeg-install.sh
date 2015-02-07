#!/bin/bash
# This script works great on travis ci! (Current env is 12.04 LTS)

# Append default repo
sudo echo "deb http://archive.ubuntu.com/ubuntu precise main restricted universe multiverse" | sudo tee -a /etc/apt/sources.list
sudo echo "deb http://extras.ubuntu.com/ubuntu precise main" | sudo tee -a /etc/apt/sources.list
sudo echo "deb-src http://extras.ubuntu.com/ubuntu precise main" | sudo tee -a /etc/apt/sources.list

# Update, upgrade etc
sudo apt-get update && sudo apt-get upgrade -y && \
sudo apt-get install -y autoconf automake build-essential git libass-dev libgpac-dev \
  libmp3lame-dev libfaac-dev libtheora-dev libtool libvorbis-dev libvpx-dev pkg-config texi2html \
  zlib1g-dev

cd /usr/local/src/ && \
sudo mkdir ffmpeg_sources && \
cd ffmpeg_sources/

# YASM
sudo wget http://www.tortall.net/projects/yasm/releases/yasm-1.2.0.tar.gz && \
sudo tar -xvf yasm-1.2.0.tar.gz && \
cd yasm-1.2.0 && \
sudo ./configure --prefix="/usr/local/src/ffmpeg_build" --bindir="/usr/local/bin" && \
sudo make && sudo make install && sudo make distclean && \
cd .. && \
sudo rm -Rf yasm-1.2.0.tar.gz yasm-1.2.0

# Libmp3lame
sudo wget http://downloads.sourceforge.net/project/lame/lame/3.99/lame-3.99.5.tar.gz && \
sudo tar -xvf lame-3.99.5.tar.gz && \
cd lame-3.99.5 && \
sudo ./configure --prefix="/usr/local/src/ffmpeg_build" --bindir="/usr/local/bin" && \
sudo make && sudo make install && sudo make disclean && \
cd .. && \
sudo rm lame-3.99.5.tar.gz

# x264
sudo git clone --depth 1 git://git.videolan.org/x264.git && \
cd x264 && \
sudo ./configure --prefix="/usr/local/src/ffmpeg_build" --bindir="/usr/local/bin" --enable-static && \
sudo make && sudo make install && sudo make distclean && \
cd ..

# fdk-aac
sudo git clone --depth 1 git://github.com/mstorsjo/fdk-aac.git && \
cd fdk-aac && \
sudo autoreconf -fiv && \
sudo ./configure --prefix="/usr/local/src/ffmpeg_build" --bindir="/usr/local/bin" --disable-shared && \
sudo make && sudo make install && sudo make distclean && \
cd ..

sudo git clone --depth 1 git://source.ffmpeg.org/ffmpeg && \
cd ffmpeg && \
sudo ./configure --prefix="/usr/local/src/ffmpeg_build" --extra-cflags="-I/usr/local/src/ffmpeg_build/include" \
  --extra-ldflags="-L/usr/local/src/ffmpeg_build/lib" --bindir="/usr/local/bin" --extra-libs="-ldl" --enable-gpl \
  --enable-libfdk-aac --enable-libmp3lame --enable-postproc \
  --enable-libtheora --enable-libvorbis --enable-libvpx --enable-libx264 --enable-nonfree && \
sudo make && sudo make install && sudo make distclean && \
hash -r && \
cd ..