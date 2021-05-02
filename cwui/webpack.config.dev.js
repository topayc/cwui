// npm install
// npm run start
var path = require("path");
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');
var fs = require('fs-extra'); // npm install --save fs-extra

var version = "3.0.0";
var proxyURL = "http://127.0.0.1:9090";
//var proxyURL = "https://demo.initech.com:8311";

module.exports = [{
  devtool: "source-map",
  entry: {
    "cwui" : "./src/main/initechApp.js"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist",
    devtoolLineToLine: true,
    sourceMapFilename: "[name]." + version + ".js.map",
    filename: "[name]." + version + ".js",
    library: '[name]',
    libraryTarget: 'umd'
  },
  plugins: [
    new ManifestPlugin({
      publicPath : "/dist/"
    }),
    new webpack.ProvidePlugin({
      "$": "jquery",
      "jQuery": "jquery"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "./"),
    // compress: true,
    port: 5000,
    // host: 'localhost',
    // historyApiFallback: true, // 404 오류 발생시 index.html 로 이동
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    proxy: {
      '/**/*.jsp': {
        target : proxyURL,
        secure : false
       },
      '/initech/demo/**': {
        target : proxyURL,
        secure : false
       },
      '/SW/vender/**': {
        target : proxyURL,
        secure : false
       },
      '/transkeyServlet': {
        target : proxyURL,
        secure : false
       },
      '/CertRelay/**': {
        target : proxyURL,
        secure : false
       }
    }
  }
}];