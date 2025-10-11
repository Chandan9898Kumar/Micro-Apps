# 🚀 Micro-Frontend Deployment Guide

Complete guide for deploying micro-frontend applications to production using Netlify and other platforms.

## 📋 Table of Contents
- [Deployment Overview](#deployment-overview)
- [Production Architecture](#production-architecture)
- [Netlify Deployment](#netlify-deployment)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Independent Updates](#independent-updates)
- [Troubleshooting](#troubleshooting)

## 🎯 Deployment Overview

### Key Questions Answered:

#### 1. **Do I need to deploy all apps separately?**
**YES** - Each micro-frontend must be deployed independently:
- ✅ **Container** → Main host application
- ✅ **App1** → Remote micro-frontend 1  
- ✅ **App2** → Remote micro-frontend 2

#### 2. **How does it work in production?**
```
Production Flow:
Container (netlify.app) → Loads remotes from → App1 (netlify.app) + App2 (netlify.app)
```

#### 3. **How do changes in App2 reflect in Container?**
**Automatic Updates** - When you deploy App2:
1. App2 builds new `remoteEntry.js`
2. Container fetches latest `remoteEntry.js` at runtime
3. Changes appear immediately (no Container redeployment needed!) : 
a. New remoteEntry.js created when build and deploye remote apps.
b. Container/host automatically gets the new remote App code at runtime!


### NOTE :

> Container must be rebuilt whenever micro-app URLs change. URL you will get when you deploy the app.

`Meaning : When you change the URLs/endpoints where micro-apps are hosted:`

```js
# Changing from:
PROD_APP2="app2@https://old-domain.netlify.app/remoteEntry.js"

# To:
PROD_APP2="app2@https://new-domain.netlify.app/remoteEntry.js"

# You must rebuild and redeploy Container


```



## 🏗️ Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📦 Container App                                               │
│  └── https://micro-container.netlify.app                       │
│      ├── Loads: app1@https://micro-app1.netlify.app/remoteEntry.js │
│      └── Loads: app2@https://micro-app2.netlify.app/remoteEntry.js │
│                                                                 │
│  📦 App1 (Remote)                                              │
│  └── https://micro-app1.netlify.app                           │
│      └── Exposes: CounterAppOne component                      │
│                                                                 │
│  📦 App2 (Remote)                                              │
│  └── https://micro-app2.netlify.app                           │
│      └── Exposes: CounterAppTwo component                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🌐 Netlify Deployment

### Step 1: Prepare Production Environment Files

#### Container `.env` file:
```bash
# container/.env
DEV_APP1="app1@http://localhost:3001/remoteEntry.js"
DEV_APP2="app2@http://localhost:3002/remoteEntry.js"

PROD_APP1="app1@https://micro-app1.netlify.app/remoteEntry.js"
PROD_APP2="app2@https://micro-app2.netlify.app/remoteEntry.js"
```

### Step 2: Build Scripts for Production

#### Update package.json scripts:
```json
{
  "scripts": {
    "start": "webpack serve",
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "serve": "serve dist -p 3000"
  }
}
```

### Step 3: Deploy Each Application

#### 🚀 **Deploy App1 First**

1. **Create Netlify Site for App1**:
   ```bash
   cd app1
   npm run build
   ```

2. **Netlify Configuration** (`app1/netlify.toml`):
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "16"
   
   [[headers]]
     for = "/remoteEntry.js"
     [headers.values]
       Access-Control-Allow-Origin = "*"
       Cache-Control = "no-cache"
   
   [[headers]]
     for = "/*.js"
     [headers.values]
       Access-Control-Allow-Origin = "*"
   ```

3. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Set build settings:
     - **Base directory**: `app1`
     - **Build command**: `npm run build`
     - **Publish directory**: `app1/dist`
   - Deploy!

4. **Note the URL**: `https://micro-app1.netlify.app`

#### ⚡ **Deploy App2**

1. **Create Another Netlify Site for App2**:
   ```bash
   cd app2
   npm run build
   ```

2. **Netlify Configuration** (`app2/netlify.toml`):
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "16"
   
   [[headers]]
     for = "/remoteEntry.js"
     [headers.values]
       Access-Control-Allow-Origin = "*"
       Cache-Control = "no-cache"
   
   [[headers]]
     for = "/*.js"
     [headers.values]
       Access-Control-Allow-Origin = "*"
   ```

3. **Deploy App2**:
   - Create new Netlify site
   - Set build settings:
     - **Base directory**: `app2`
     - **Build command**: `npm run build`
     - **Publish directory**: `app2/dist`

4. **Note the URL**: `https://micro-app2.netlify.app`

#### 🏠 **Deploy Container (Host)**

1. **Update Container Environment**:
   ```bash
   # container/.env
   PROD_APP1="app1@https://micro-app1.netlify.app/remoteEntry.js"
   PROD_APP2="app2@https://micro-app2.netlify.app/remoteEntry.js"
   ```

2. **Container Netlify Configuration** (`container/netlify.toml`):
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "16"
     PROD_APP1 = "app1@https://micro-app1.netlify.app/remoteEntry.js"
     PROD_APP2 = "app2@https://micro-app2.netlify.app/remoteEntry.js"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy Container**:
   - Create new Netlify site
   - Set build settings:
     - **Base directory**: `container`
     - **Build command**: `npm run build`
     - **Publish directory**: `container/dist`
   - Add environment variables in Netlify dashboard

4. **Final URL**: `https://micro-container.netlify.app`

## ⚙️ Environment Configuration

### Development vs Production URLs

#### Webpack Configuration Update:
```javascript
// container/webpack.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  
  return {
    plugins: [
      new ModuleFederationPlugin({
        name: "container",
        remotes: {
          app1: isProduction 
            ? "app1@https://micro-app1.netlify.app/remoteEntry.js"
            : "app1@http://localhost:3001/remoteEntry.js",
          app2: isProduction 
            ? "app2@https://micro-app2.netlify.app/remoteEntry.js" 
            : "app2@http://localhost:3002/remoteEntry.js",
        },
        shared: {
          react: { singleton: true },
          "react-dom": { singleton: true },
        },
      }),
    ],
  };
};
```

### Environment Variables in Netlify

1. **Go to Site Settings** → Environment Variables
2. **Add Variables**:
   ```
   PROD_APP1 = app1@https://micro-app1.netlify.app/remoteEntry.js
   PROD_APP2 = app2@https://micro-app2.netlify.app/remoteEntry.js
   NODE_ENV = production
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### `.github/workflows/deploy-app1.yml`:
```yaml
name: Deploy App1

on:
  push:
    branches: [ main ]
    paths: [ 'app1/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: |
          cd app1
          npm install
          
      - name: Build
        run: |
          cd app1
          npm run build
          
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './app1/dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy App1 from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_APP1_SITE_ID }}
```

#### Similar workflows for App2 and Container

## 🔄 Independent Updates Process

### Scenario: Update App2 and see changes in Container

#### Step-by-Step Process:

1. **Make Changes to App2**:
   ```bash
   cd app2
   # Edit src/components/CounterAppTwo.tsx
   # Change button text or functionality
   ```

2. **Test Locally**:
   ```bash
   npm start  # Test all apps locally
   ```

3. **Deploy Only App2**:
   ```bash
   cd app2
   npm run build
   # Push to GitHub or deploy directly to Netlify
   ```

4. **Automatic Update**:
   - ✅ App2 deploys new `remoteEntry.js`
   - ✅ Container automatically loads new version
   - ✅ Changes appear immediately in production
   - ✅ **No Container redeployment needed!**

### Why This Works:

```javascript
// Container loads App2 at runtime
const CounterAppTwo = React.lazy(() => import("app2/CounterAppTwo"));

// This import fetches the latest remoteEntry.js from:
// https://micro-app2.netlify.app/remoteEntry.js
```

## 📋 Deployment Checklist

### Pre-Deployment:
- [ ] All apps build successfully locally
- [ ] Environment variables configured
- [ ] CORS headers set for remoteEntry.js
- [ ] Production URLs updated in webpack config

### App1 Deployment:
- [ ] Create Netlify site for App1
- [ ] Configure build settings
- [ ] Add netlify.toml with CORS headers
- [ ] Deploy and note URL
- [ ] Test remoteEntry.js accessibility

### App2 Deployment:
- [ ] Create Netlify site for App2
- [ ] Configure build settings
- [ ] Add netlify.toml with CORS headers
- [ ] Deploy and note URL
- [ ] Test remoteEntry.js accessibility

### Container Deployment:
- [ ] Update production URLs in webpack config
- [ ] Create Netlify site for Container
- [ ] Add environment variables
- [ ] Configure SPA redirects
- [ ] Deploy and test full integration

### Post-Deployment:
- [ ] Test all micro-frontends load correctly
- [ ] Verify state sharing works
- [ ] Check browser console for errors
- [ ] Test on different devices/browsers

## 🐛 Troubleshooting

### Common Issues:

#### 1. **CORS Errors**
```
Access to fetch at 'https://micro-app1.netlify.app/remoteEntry.js' 
from origin 'https://micro-container.netlify.app' has been blocked by CORS policy
```

**Solution**: Add CORS headers in `netlify.toml`:
```toml
[[headers]]
  for = "/remoteEntry.js"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

#### 2. **ChunkLoadError**
```
ChunkLoadError: Loading chunk app1 failed
```

**Solutions**:
- Check if App1 is deployed and accessible
- Verify remoteEntry.js URL is correct
- Check network tab for 404 errors

#### 3. **Module Not Found**
```
Module not found: Can't resolve 'app1/CounterAppOne'
```

**Solutions**:
- Ensure App1 is running/deployed
- Check webpack configuration
- Verify expose configuration in App1

#### 4. **Environment Variables Not Working**
**Solutions**:
- Check Netlify environment variables
- Restart build after adding variables
- Use `console.log(process.env)` to debug

### Debug Commands:

```bash
# Test remoteEntry.js accessibility
curl https://micro-app1.netlify.app/remoteEntry.js

# Check build output
npm run build && ls -la dist/

# Test production build locally
npm run build && npx serve dist -p 3000
```

## 🚀 Advanced Deployment Strategies

### 1. **Blue-Green Deployment**
- Deploy to staging URLs first
- Test thoroughly
- Switch production URLs
- Rollback if issues occur

### 2. **Canary Deployment**
- Deploy new version to subset of users
- Monitor metrics and errors
- Gradually increase traffic
- Full rollout or rollback

### 3. **Multi-Environment Setup**
```
Development: localhost:3000, localhost:3001, localhost:3002
Staging: staging-container.netlify.app, staging-app1.netlify.app
Production: micro-container.netlify.app, micro-app1.netlify.app
```

## 📊 Monitoring & Analytics

### Key Metrics to Track:
- **Load Times**: How fast do micro-frontends load?
- **Error Rates**: Failed remote loads
- **Bundle Sizes**: Monitor bundle growth
- **User Experience**: Cross-micro-frontend interactions

### Tools:
- **Netlify Analytics**: Built-in traffic analytics
- **Sentry**: Error tracking across micro-frontends
- **Google Analytics**: User behavior tracking
- **Lighthouse**: Performance monitoring

## 🔐 Security Considerations

### Production Security:
1. **HTTPS Only**: All micro-frontends must use HTTPS
2. **CSP Headers**: Configure Content Security Policy
3. **Dependency Scanning**: Regular security audits
4. **Access Control**: Restrict admin functions

### Example CSP Header:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://micro-app1.netlify.app https://micro-app2.netlify.app; connect-src 'self' https://micro-app1.netlify.app https://micro-app2.netlify.app"
```

---

## 🎉 Success! Your Micro-Frontends are Live!

After following this guide, you'll have:
- ✅ **3 independent deployments** on Netlify
- ✅ **Automatic updates** when you change any micro-frontend
- ✅ **Production-ready** micro-frontend architecture
- ✅ **CI/CD pipeline** for continuous deployment

### Final URLs:
- 🏠 **Container**: https://micro-container.netlify.app
- 🚀 **App1**: https://micro-app1.netlify.app  
- ⚡ **App2**: https://micro-app2.netlify.app

**Happy Deploying! 🚀**