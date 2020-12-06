const path = require("path");

module.exports = {
  devServer: {
    compress: true,
    hot: true,
    open: true,
    port: 9001
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    performance: {
      hints: false
    }
  }
};
