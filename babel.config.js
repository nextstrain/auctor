const utils = require('auspice/cli/utils');

/* What variables does this config depend on?
 * process.env.BABEL_EXTENSION_PATH -- a resolved path
 * api.env -- this is process.env.BABEL_ENV if it exists (it should)
 */

module.exports = function babelConfig(api) {
  utils.verbose(`Generating Babel Config`);
  const presets = [
    "@babel/env",
    "@babel/preset-react"
  ];
  const plugins = [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    "babel-plugin-styled-components",
    "babel-plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime",
    "lodash",
    ["strip-function-call", {strip: ["timerStart", "timerEnd"]}],
    "react-hot-loader/babel"
  ];
  api.cache(true);
  return {
    presets,
    plugins,
    sourceType: "unambiguous"
  };
};