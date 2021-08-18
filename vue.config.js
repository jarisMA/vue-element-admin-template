const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  outputDir: "current_dist",
  devServer: {
    open: true,
    host: `admin-test${process.env.VUE_APP_DOMAIN}`,
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/assets/styles/variable.less")],
    },
  },
  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/plugins/icons/svg"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/plugins/icons/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // set text-loader
    config.module
      .rule("md")
      .test(/\.md$/)
      .use("text-loader")
      .loader("text-loader")
      .end();
    config.resolve.alias
      .set("assets", resolve("src/assets"))
      .set("images", resolve("src/assets/images"))
      .set("styles", resolve("src/assets/styles"))
      .set("components", resolve("src/components"))
      .set("request", resolve("src/global/request"))
      .set("service", resolve("src/global/service"))
      .set("router", resolve("src/router"))
      .set("store", resolve("src/store"))
      .set("plugins", resolve("src/plugins"))
      .set("utils", resolve("src/utils"))
      .set("views", resolve("src/views"));
  },
};
