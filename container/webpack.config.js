// Required plugins and utilities for webpack configuration
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Generates HTML file and injects bundles
const webpack = require("webpack"); // Core webpack functionality
const { ModuleFederationPlugin } = webpack.container; // Enables micro-frontend architecture
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin"); // TypeScript type checking in separate process
const deps = require("./package.json").dependencies; // Gets dependency versions for sharing
require("dotenv").config({ path: "./.env" }); // Load environment variables from .env file

// Generate build timestamp for version tracking
const buildDate = new Date().toLocaleString();

// Export webpack configuration as a function to access build mode
module.exports = (env, argv) => {
  // Determine if we're building for production or development
  const isProduction = argv.mode === "production";
  
  return {
    // Entry point - where webpack starts building the dependency graph
    entry: "./src/index.ts",
    
    // Build mode - affects optimizations and bundle size
    mode: isProduction ? "production" : "development",
    
    // Development server configuration for local development
    devServer: {
      port: 3000, // Main container port - other micro-frontends connect to this
      open: true, // Automatically open browser when server starts
      hot: true, // Enable hot module replacement for faster development
      historyApiFallback: true, // Serve index.html for all routes (SPA routing support)
      headers: {
        // Allow cross-origin requests - essential for micro-frontend communication
        "Access-Control-Allow-Origin": "*",
      },
    },

    // File resolution configuration
    resolve: {
      // File extensions webpack will resolve automatically
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },

    // Module processing rules
    module: {
      rules: [
        {
          // Match TypeScript and JavaScript files (including JSX/TSX)
          test: /\.(js|jsx|tsx|ts)$/,
          loader: "babel-loader", // Use Babel to transpile modern JS/TS
          exclude: /node_modules/, // Don't process node_modules (already transpiled)
          options: {
            cacheDirectory: true, // Cache transpilation results for faster builds
            babelrc: false, // Don't use .babelrc file, use inline config
            presets: [
              [
                "@babel/preset-env", // Transform modern JavaScript for browser compatibility
                { targets: { browsers: "last 2 versions" } }, // Support last 2 browser versions
              ],
              "@babel/preset-typescript", // Transform TypeScript to JavaScript
              ["@babel/preset-react", { runtime: "automatic" }], // Transform React JSX with automatic runtime
            ],
            plugins: [
              // Enable class properties syntax (for React class components)
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
        {
          // Process CSS files
          test: /\.css$/,
          use: [
            "style-loader", // Inject CSS into DOM via <style> tags
            "css-loader", // Resolve CSS imports and url() references
          ],
        },
      ],
    },

    // Webpack plugins
    plugins: [
      // Make environment variables available in the bundle
      new webpack.EnvironmentPlugin({ 
        BUILD_DATE: buildDate, // Inject build timestamp
      }),
      
      // Module Federation Plugin - Core of micro-frontend architecture
      new ModuleFederationPlugin({
        // Unique name for this container application
        name: "container",
        
        // Filename for the federation manifest
        filename: "remoteEntry.js",
        
        // Utilities and services this container exposes to micro-frontends
        exposes: {
          "./utils": "./src/utils/index", // Shared utility functions
          "./contextBridge": "./src/utils/contextBridge", // State management bridge
        },
        
        // Remote micro-frontends this container can load
        remotes: {
          // Dynamic URLs based on environment (dev vs prod)
          app1: isProduction ? process.env.PROD_APP1 : process.env.DEV_APP1,
          app2: isProduction ? process.env.PROD_APP2 : process.env.DEV_APP2,
        },
        
        // Shared dependencies to avoid duplication across micro-frontends
        shared: {
          react: { 
            singleton: true, // Only one instance of React across all micro-frontends
            requiredVersion: deps.react, // Ensure version compatibility
          },
          "react-dom": {
            singleton: true, // Only one instance of ReactDOM
            requiredVersion: deps["react-dom"], // Ensure version compatibility
          },
          zustand: {
            singleton: true, // Only one instance of Zustand across all apps
            eager: true, // Load zustand immediately when container loads
            requiredVersion: deps.zustand, // Ensure version compatibility
          },
        },
      }),
      
      // Generate HTML file and inject webpack bundles
      new HtmlWebpackPlugin({
        template: "./public/index.html", // Use custom HTML template
      }),
      
      // TypeScript type checking in separate process (doesn't block builds)
      new ForkTsCheckerWebpackPlugin({
        async: !isProduction, // Async in dev for faster builds, sync in prod for reliability
      }),
    ],
  };
}