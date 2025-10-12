const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  
  return {
    entry: "./src/index.ts",
    mode: isProduction ? "production" : "development",
    
    devServer: {
      port: 3001, // ← This port number
      open: true,
      hot: true,
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
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                "@babel/preset-typescript",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    
    plugins: [
      new ModuleFederationPlugin({
        name: "app1",  // ← This becomes the remote name
        filename: "remoteEntry.js", // ← This is the manifest file
        exposes: {
          "./CounterAppOne": "./src/components/CounterAppOne", // ← Expose your component
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
    ],
  };
};