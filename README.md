
# cordova-support-gradlenstein

This [Cordova plugin](https://www.npmjs.com/package/cordova-support-gradlenstein) help you modify your original android build.gradle file, which means that you can create your very peculiar Gradle Frankenstein build file.

With this plugin you can easily apply plugins that are unsupported by build-extras.gradle file.

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
