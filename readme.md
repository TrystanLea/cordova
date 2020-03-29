# Installation

# Node JS

    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt-get install -y nodejs

    node -v
    v13.12.0

# Cordova

    sudo npm install -g cordova 

# Java

    apt-get install software-properties-common
    add-apt-repository ppa:linuxuprising/java
    apt-get update
    apt-get install oracle-java13-installer

# Gradle

    apt-get install unzip zip
    curl -s "https://get.sdkman.io" | bash
    source "/root/.sdkman/bin/sdkman-init.sh"
    sdk install gradle 6.3

# Android Studio and SDK

https://developer.android.com/studio/

# bash_profile

In your home folder create a file called '.bash_profile' to hold relevant environment variables:

    [[ -s "$HOME/.profile" ]] && source "$HOME/.profile" # Load the default .profile

    [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

    export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
    export ANDROID_HOME="$HOME/Android/Sdk"
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools

Load profile - every time you start a new bash window to create cordova applications - with: 

    source .bash_profile

# Hello World App

    cordova create MyApp

    cd MyApp
    cordova platform add browser
    cordova platform add android

    cordova run android --device
