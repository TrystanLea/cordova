## Installation

- [Basic Cordova Hello World](https://cordova.apache.org/)
- [Cordova Android Platform Installation Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)

### 1. Node JS

    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt-get install -y nodejs

    node -v
    v13.12.0

### 2. Java

IMPORTANT: Version 8 required.

    sudo apt install openjdk-8-jdk
    sudo apt install openjdk-8-jdk-headless

Select version 8 of both:
    
    sudo update-alternatives --config java
    sudo update-alternatives --config javac

### 3. Gradle

    apt-get install unzip zip
    curl -s "https://get.sdkman.io" | bash
    
To confirm either run: or open a new window..

    source ~/.bashrc
    source "/root/.sdkman/bin/sdkman-init.sh"

    sdk install gradle 6.3

### 4. Android Studio and SDK

https://developer.android.com/studio

1. Download Android Studio
2. Unzip to home directory
3. Run android-studio/bin/studio.sh
4. Installation process will now start, select 'standard installation', android-studio will now download further packages.

In Android Studio > Configure > SDK Manager > SDK Platforms tab, I have Android 10 (Q) API level 29 and Android 9 (Pie) API level 28 installed.
Under the SDK Tools tab I have Android SDK Build Tools, Android Emulator, Android SDK Platform Tools and Android SDK Command line tools installed

I have the following directories in my Android/Sdk directory:

    build-tools  emulator  licenses  patcher  platforms  platform-tools  skins  sources  system-images  tools

### 5. bash_profile

In your home folder create a file called '.bash_profile' to hold relevant environment variables:

    [[ -s "$HOME/.profile" ]] && source "$HOME/.profile" # Load the default .profile

    [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

    export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
    export ANDROID_HOME="$HOME/Android/Sdk"
    export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools

Load profile - every time you start a new bash window to create cordova applications - with: 

    source .bash_profile

### 6. Cordova

    sudo npm install -g cordova 

### 7. Hello World App

To test that the above is all working try creating the basic Hello World app that comes with Cordova. 

In a location of your choice, e.g /home/username initialise a cordova app:

    cordova create MyApp

Add browser and android platform support to the app:

    cd MyApp
    cordova platform add browser
    cordova platform add android

Run on physical android device with Developer mode and USB debugging turned on:

    cordova run android --device
