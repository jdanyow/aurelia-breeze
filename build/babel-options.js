var path = require('path');
var paths = require('./paths');

module.exports = {
  filename: '',
  filenameRelative: '',
  modules: '',
  sourceMap: true,
  sourceMapName: '',
  sourceRoot: '',
  moduleRoot: path.resolve('src').replace(/\\/g, '/'),
  moduleIds: false,
  experimental: false,
  comments: false,
  compact: false,
  code:true,
  stage:0,
  loose: "all",
  optional: [],
  plugins: [
    "babel-dts-generator"
  ],
  extra: {
    dts: {
      packageName: paths.packageName,
      typings: '',
      suppressModulePath: true,
      suppressComments: false,
      memberOutputFilter: /^_.*/
    }
  }
};
