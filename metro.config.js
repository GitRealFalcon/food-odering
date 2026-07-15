const { withUniwindConfig } = require('uniwind/metro');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro"); 

const config = getSentryExpoConfig(__dirname);

// your metro modifications

module.exports = withUniwindConfig(config, {  
  // relative path to your global.css file (from previous step)
  cssEntryFile: './app/global.css',
  // (optional) path where we gonna auto-generate typings
  // defaults to project's root
  dtsFile: './app/uniwind-types.d.ts'
});