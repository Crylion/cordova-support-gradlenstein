
# cordova-support-gradlenstein

This [Cordova plugin](https://www.npmjs.com/package/cordova-support-gradlenstein) help you modify your original android build.gradle file, which means that you can create your very peculiar Gradle Frankenstein build file.

With this plugin you can easily apply plugins that are unsupported by build-extras.gradle file.

This first version is really at its earlier stage of development, it's expected to improve the build.gradle file parser in order to avoid duplications and also to allow differentiation between repositories and dependencies blocks (buildscript x root).

By now, this works for buildscript extension (classpath dependencies and plugins to apply), other needed dependencies can be explicited using build-extras.gradle file.
BEWARE the blocks order in build.gradle, buildscript block MUST come first. 

## Installation

Add this plugin in your project:

``` shell
# cordova plugin add cordova-support-gradlenstein --save
```

> If there is a problem with the build, you may need to manually format and sync gradle.

## Usage

Create the file *./platforms/android/gradlenstein.json* like the example below (add firebase analytics and crashlytics support):

``` javascript
{
	"repositories": [
		"maven { url 'https://maven.google.com' }",
		"maven { url 'https://maven.fabric.io/public' }",
		"google()"
	],

	"buildscriptDependencies": [
		{ "id": "io.fabric.tools:gradle", "version": "1.31.0"},
		{ "id": "com.google.gms:google-services", "version": "4.1.0"}
	],

	"plugins": [
		"io.fabric",
		"com.google.gms.google-services"
	]	
}
```

## Result

The example above will modify the build.gradle file as the following:

``` groovy
apply plugin: 'com.android.application'
apply plugin: "com.google.gms.google-services"			// <-- line added
apply plugin: "io.fabric"					// <-- line added

buildscript {
    repositories {
	jcenter()					
	maven { url 'https://maven.google.com' }		// <-- line added
	maven { url 'https://maven.fabric.io/public' }		// <-- line added
	google()						// <-- line added
    }
    
     dependencies {
        classpath 'com.android.tools.build:gradle:3.0.0'
	
	classpath "com.google.gms:google-services:4.1.0"	// <-- line added
	classpath "io.fabric.tools:gradle:1.31.0"		// <-- line added
    }
}
...
```

## Acknowledgment

This plugin was inspired by the cordova-support-kotlin (code) and by many suffering human beings that lurks stackoverflow searching for the light.  
