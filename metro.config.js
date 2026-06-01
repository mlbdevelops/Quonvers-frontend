const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
config.watcher.blocklist = [
  /node_modules\/.*/,
];
module.exports = withNativeWind(config, { input: './app/global.css' });