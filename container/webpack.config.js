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
        remotes: {
          app1: "app1@http://localhost:3001/remoteEntry.js",
          app2: "app2@http://localhost:3002/remoteEntry.js",
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