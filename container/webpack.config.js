const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const deps = require("./package.json").dependencies;
require("dotenv").config({ path: "./.env" });

const buildDate = new Date().toLocaleString();

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  
  return {
    entry: "./src/index.ts",
    mode: isProduction ? "production" : "development",
    
    devServer: {
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } },
              ],
              "@babel/preset-typescript",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    plugins: [
      new webpack.EnvironmentPlugin({ 
        BUILD_DATE: buildDate,
      }),
      
      new ModuleFederationPlugin({
        name: "container",
        filename: "remoteEntry.js",
        exposes: {
          "./utils": "./src/utils/index",
          "./contextBridge": "./src/utils/contextBridge",
        },
        remotes: {
          app1: isProduction ? process.env.PROD_APP1 : process.env.DEV_APP1,
          app2: isProduction ? process.env.PROD_APP2 : process.env.DEV_APP2,
        },
        shared: {
          react: { 
            singleton: true, 
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      
      new ForkTsCheckerWebpackPlugin({
        async: !isProduction,
      }),
    ],
  };
}