const fs = require('fs');
const gradleFilename = './platforms/android/build.gradle';
const gradlensteinFile = './platforms/android/gradlenstein.json'
const buildContent = fs.readFileSync(gradleFilename).toString();

console.log("[GradlEnstein] /w\\  /w\\     /w\\         /w\\")

var gradlensteinData = {}
if (fs.existsSync(gradlensteinFile)) {
  console.log("[GradlEnstein] configuration file found!")
  try {
    gradlensteinData = JSON.parse(fs.readFileSync(gradlensteinFile).toString());
    console.log("[GradlEnstein] configuration data loaded successfully!")
    console.log(gradlensteinData)
  } catch(err) {
    console.log("[GradlEnstein] An error occurred while parsing the configuration file: " + err)
  }
} else {
  console.log("[GradlEnstein] configuration file NOT FOUND!")
}

const REPOSITORIES = gradlensteinData.repositories ? gradlensteinData.repositories : []
/* [
  "maven { url 'https://maven.google.com' }",
  "maven { url 'https://maven.fabric.io/public' }",
  "google()"
] */

// TODO read from outside :B
const BUILDSCRIPT_DEPENDENCIES = gradlensteinData.buildscriptDependencies ? gradlensteinData.buildscriptDependencies : []
/* [ // aka classspath :B
    { id: "io.fabric.tools:gradle", version: "1.31.0"},
    { id: "com.google.gms:google-services", version: "4.1.0"}
] */

const PLUGINS_TO_APPLY = gradlensteinData.plugins ? gradlensteinData.plugins : []
/* [
    "io.fabric",
    "com.google.gms.google-services"
] */

let rewrite = buildContent;
// TODO:Not Exist Kotlin-Version
// if (!buildContent.match(/ext.kotlin_version/g)) appendContent(/buildscript(\s+|)\{\s+/g, KOTLIN_VERSION);

REPOSITORIES.forEach(entry => {
  // TODO must differentiate buildscript repositories from root repositories
  console.log("Adding REPOSITORY... " + entry)
  appendContent(/repositories(\s+|)\{\s+/g, `\n${entry}\n`);
})

BUILDSCRIPT_DEPENDENCIES.forEach(entry => {
  // TODO must differentiate buildscript repositories from root repositories
  if (!buildContent.match(/entry['id']/g)) {
    let dependency = `\nclasspath "${entry['id']}:${entry['version']}"\n`;
    console.log("Adding BUILDSCRIPT dependency... " + dependency)
    appendContent(/classpath\s+(['"])[\w.:]+(['"])/g, dependency);
  }
});

PLUGINS_TO_APPLY.forEach(entry => {
  let plugin = `\napply plugin: "${entry}"\n`
  var pluginRegExp = new RegExp("apply\\s+plugin(:|\\s+:)(\\s+|)(['\"])" + entry + "(['\"])", "g")
  if (!buildContent.match(pluginRegExp)) {
    console.log("Adding PLUGIN (apply)... " + entry)
    appendContent(/com.android.application['"]/g, plugin);
  }
});

function appendContent(reg, content) {
    const pos = rewrite.search(reg);
    const len = rewrite.match(reg)[0].length;
    const header = rewrite.substring(0, pos + len);
    const footer = rewrite.substring(pos + len);
    rewrite = header + content + footer;
}

fs.writeFileSync(gradleFilename, rewrite);
