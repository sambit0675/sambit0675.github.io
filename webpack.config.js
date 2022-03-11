const path = require('path');
 const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")


 module.exports = {
  mode: 'development',
   entry: {
     sample: './sample/index.js',
   },
   plugins: [
    new NodePolyfillPlugin(),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'sample/js'),
     clean: true,
   },
   resolve: {
       fallback:{
           fs: false,
       }
   }
 };
