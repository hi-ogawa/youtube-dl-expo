const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.watchFolders.push(path.resolve(__dirname, "packages", "common"));

module.exports = config;
