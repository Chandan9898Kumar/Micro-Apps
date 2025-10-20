// Required plugins for webpack configuration
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Generates HTML file and injects bundles
const { ModuleFederationPlugin } = require("webpack").container; // Enables micro-frontend architecture
const deps = require("./package.json").dependencies; // Gets dependency versions for sharing
require("dotenv").config({ path: "./.env" }); // Load environment variables from .env file

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
      port: 3002, // Port for this micro-frontend (different from app1:3001 and container:3000)
      open: true, // Automatically open browser when server starts
      hot: true, // Enable hot module replacement for faster development
      headers: {
        // Allow cross-origin requests - needed for micro-frontend communication
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
          use: {
            // Use Babel to transpile modern JS/TS to browser-compatible code
            loader: "babel-loader",
            options: {
              presets: [
                // Transform modern JavaScript for browser compatibility
                ["@babel/preset-env", { targets: "defaults" }],
                // Transform TypeScript to JavaScript
                "@babel/preset-typescript",
                // Transform React JSX with automatic runtime (no need to import React)
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
          // Don't process node_modules (already transpiled)
          exclude: /node_modules/,
        },
      ],
    },
    
    // Webpack plugins
    plugins: [
      // Module Federation Plugin - Core of micro-frontend architecture
      new ModuleFederationPlugin({
        // Unique name for this micro-frontend
        name: "app2",
        
        // Filename for the federation manifest
        filename: "remoteEntry.js",
        
        // Components this micro-frontend exposes to others
        exposes: {
          "./CounterAppTwo": "./src/components/CounterAppTwo", // Export CounterAppTwo component
        },
        
        // Remote micro-frontends this app can consume
        remotes: {
          // Connect to container app for shared utilities - dynamic URL based on environment
          container: isProduction ? process.env.PROD_CONTAINER : process.env.DEV_CONTAINER,
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
            singleton: true, // Use container's version when available, fallback to own
            requiredVersion: deps.zustand,
          },
        },
      }),
      
      // Generate HTML file and inject webpack bundles
      new HtmlWebpackPlugin({
        template: "./public/index.html", // Use custom HTML template
      }),
    ],
  };
};