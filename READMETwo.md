# 🚀 Micro-Frontend Architecture with Module Federation

A complete guide to building, understanding, and deploying micro-frontends using Webpack Module Federation, React, and Lerna monorepo management.

## 📋 Table of Contents

- [🎯 What is This Project?](#what-is-this-project)
- [🏗️ Architecture Overview](#architecture-overview)
- [📁 Project Structure](#project-structure)
- [🤔 Common Developer Questions](#common-developer-questions)
- [🚀 Getting Started](#getting-started)
- [🔄 Development Workflow](#development-workflow)
- [🌐 Production Deployment](#production-deployment)
- [🐛 Troubleshooting](#troubleshooting)

## 🎯 What is This Project?

This project demonstrates a **micro-frontend architecture** where multiple independent React applications work together as a single system. Think of it like building with LEGO blocks - each app is a separate block that can be developed, tested, and deployed independently, but they all fit together to create a complete application.

### Real-World Example:
Imagine Netflix's interface:
- **Container/Host**: Main Netflix shell (navigation, user profile)
- **Remote App1**: Movie browsing component
- **Remote App2**: Video player component
- **Remote App3**: Recommendations component

Each team can work on their component independently, deploy separately, but users see one cohesive Netflix experience.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MICRO-FRONTEND SYSTEM                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏠 Container/Host (Port 3000)                             │
│  ├── Orchestrates the entire application                   │
│  ├── Provides shared utilities & state management          │
│  ├── Loads remote micro-frontends dynamically              │
│  └── Exposes: utils, contextBridge                         │
│                                                             │
│  🚀 App1 - Remote Micro-frontend (Port 3001)              │
│  ├── Independent React application                         │
│  ├── Counter with increment functionality                  │
│  ├── Uses shared utilities from container                  │
│  └── Exposes: CounterAppOne component                      │
│                                                             │
│  ⚡ App2 - Remote Micro-frontend (Port 3002)              │
│  ├── Independent React application                         │
│  ├── Counter with multiply functionality                   │
│  ├── Uses shared utilities from container                  │
│  └── Exposes: CounterAppTwo component                      │
│                                                             │
│  📦 Root - Monorepo Management                             │
│  ├── Lerna for managing multiple packages                  │
│  ├── Shared scripts and dependencies                       │
│  └── Workspace configuration                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
Micro-frontend/                                    ← ROOT REPOSITORY
├── .git/                                         ← Git repository
├── .github/workflows/                            ← CI/CD pipelines
│   ├── complete-ci-cd.yml                       ← Full CI/CD with testing
│   └── micro-frontend-cicd.yml                  ← Simple deployment pipeline
├── Microfrontend-ModuleFederation-React-Lerna/  ← MAIN PROJECT FOLDER
│   ├── package.json                             ← Root workspace config
│   ├── lerna.json                               ← Lerna monorepo config
│   ├── 
│   ├── container/                               ← HOST APPLICATION
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── utils/                           ← Shared utilities
│   │   │   │   ├── index.ts                    ← formatCurrency, generateId
│   │   │   │   └── contextBridge.ts            ← State management
│   │   │   ├── store/                          ← Global Zustand store
│   │   │   ├── App.tsx                         ← Main container app
│   │   │   └── index.ts                        ← Entry point
│   │   ├── webpack.config.js                   ← Module Federation config
│   │   ├── package.json                        ← Container dependencies
│   │   └── .env                                ← Environment variables
│   │
│   ├── app1/                                   ← REMOTE APPLICATION 1
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── CounterAppOne.tsx           ← Exposed component
│   │   │   ├── store/
│   │   │   │   └── app1Store.ts                ← App1-specific Zustand store
│   │   │   └── index.ts                        ← Entry point
│   │   ├── webpack.config.js                   ← Module Federation config
│   │   ├── package.json                        ← App1 dependencies
│   │   └── .env                                ← Environment variables
│   │
│   └── app2/                                   ← REMOTE APPLICATION 2
│       ├── src/
│       │   ├── components/
│       │   │   └── CounterAppTwo.tsx           ← Exposed component
│       │   ├── store/
│       │   │   └── app2Store.ts                ← App2-specific Zustand store
│       │   └── index.ts                        ← Entry point
│       ├── webpack.config.js                   ← Module Federation config
│       ├── package.json                        ← App2 dependencies
│       └── .env                                ← Environment variables
│
├── README.md                                   ← This file
└── CICD-SETUP.md                              ← CI/CD setup guide
```

## 🤔 Common Developer Questions

### ❓ **Q1: Is this a Monorepo or Polyrepo? How does it work?**

**A:** This is a **MONOREPO** - one Git repository containing multiple applications. Here's how it works:

**Monorepo Structure:**
```
Micro-frontend/                    ← Single Git Repository
├── .git/                         ← One Git history for all apps
├── app1/                         ← Separate application
├── app2/                         ← Separate application  
├── container/                    ← Separate application
└── package.json                  ← Workspace coordinator
```

**vs Polyrepo (Alternative Approach):**
```
micro-app1-repo/                  ← Separate Git Repository
├── .git/
└── app1/

micro-app2-repo/                  ← Separate Git Repository  
├── .git/
└── app2/

micro-container-repo/             ← Separate Git Repository
├── .git/
└── container/
```

### ❓ **Q2: How does the Monorepo workflow work?**

**A:** Here's the complete development and deployment flow:

**Development Workflow:**
```bash
# 1. Make changes to any app
vim app1/src/components/CounterAppOne.tsx
vim app2/src/components/CounterAppTwo.tsx

# 2. Commit from ROOT (all changes in one commit)
cd Micro-frontend/  # Root directory
git add .
git commit -m "Update app1 counter and app2 styling"
git push origin main

# 3. CI/CD automatically detects which apps changed
# 4. Only changed apps get deployed
```

**CI/CD Smart Detection:**
```yaml
# .github/workflows/ci-cd.yml
detect-changes:
  outputs:
    app1: ${{ steps.changes.outputs.app1 }}     # true (changed)
    app2: ${{ steps.changes.outputs.app2 }}     # true (changed)
    container: ${{ steps.changes.outputs.container }} # false (unchanged)

# Only app1 and app2 jobs run, container skipped
```

**Deployment Result:**
```
✅ App1 → https://micro-app1.netlify.app (updated)
✅ App2 → https://micro-app2.netlify.app (updated)
⏸️ Container → https://micro-container.netlify.app (unchanged)

# Container automatically loads new app1 & app2 versions at runtime
```

### ❓ **Q3: Why do we have a ROOT repository manager?**

**A:** The root repository serves as a **monorepo manager** using Lerna. Here's why:

```json
// Root package.json
{
  "workspaces": {
    "packages": ["app1", "app2", "container"]
  }
}
```

**Benefits:**
- **Unified Commands**: `npm start` runs all apps simultaneously
- **Shared Dependencies**: Common packages installed once
- **Coordinated Releases**: Deploy multiple apps together
- **Simplified CI/CD**: One pipeline for all apps

**Without Root:** You'd need to manually start each app:
```bash
# Without root - manual process
cd container && npm start &
cd app1 && npm start &
cd app2 && npm start &
```

**With Root:** One command starts everything:
```bash
# With root - automated
npm start  # Starts all apps in parallel
```

### ❓ **Q2: What's the difference between Container/Host and Remote apps?**

| Aspect | Container/Host | Remote Apps |
|--------|----------------|-------------|
| **Role** | Orchestrator | Feature providers |
| **Responsibility** | Load & display remotes | Expose components |
| **Dependencies** | Provides shared libs | Consumes shared libs |
| **URL** | Main application URL | Background services |
| **User Access** | Direct user interaction | Loaded by container |

**Example:**
```javascript
// Container loads remotes
const CounterAppOne = React.lazy(() => import("app1/CounterAppOne"));
const CounterAppTwo = React.lazy(() => import("app2/CounterAppTwo"));

// Container displays them
<CounterAppOne />
<CounterAppTwo />
```

### ❓ **Q3: Why install node_modules in ROOT?**

**A:** Root node_modules serves **workspace management**, not application code:

```
Root node_modules/
├── lerna/           ← Manages multiple packages
├── concurrently/    ← Runs multiple commands
└── shared-tools/    ← Development utilities

App node_modules/
├── react/           ← Application dependencies
├── webpack/         ← Build tools
└── zustand/         ← State management
```

**Root package.json (Workspace Manager Only):**
```json
{
  "private": true,
  "workspaces": {
    "packages": ["app1", "app2", "container"]
  },
  "scripts": {
    "start": "lerna run --parallel start",
    "build": "lerna run build"
  },
  "devDependencies": {
    "lerna": "3.22.1"        // ← ONLY workspace management
  }
  // ❌ NO application dependencies here!
}
```

**App package.json (Actual Dependencies):**
```json
{
  "name": "app1",
  "dependencies": {
    "react": "^17.0.2",      // ← Actual application code
    "zustand": "^4.4.0",     // ← Feature dependencies
    "@chakra-ui/react": "^1.8.1"
  },
  "devDependencies": {
    "webpack": "^5.67.0",    // ← Build tools
    "typescript": "^4.2.4"
  }
}
```

**Key Point:** Root has NO application dependencies - only workspace management tools!

### ❓ **Q4: Wait, our root package.json has no React/Zustand - how do apps work?**

**A:** This confuses many developers! Here's the truth:

**Root Dependencies (What We Actually Have):**
```json
{
  "devDependencies": {
    "lerna": "3.22.1"  // ← Only this!
  }
  // ❌ No react, no zustand, no webpack
}
```

**How Apps Still Work:**
```bash
# Each app has its OWN node_modules:
app1/node_modules/
├── react/           ← App1's React
├── zustand/         ← App1's Zustand  
├── webpack/         ← App1's Webpack
└── ...

app2/node_modules/
├── react/           ← App2's React
├── zustand/         ← App2's Zustand
└── ...

container/node_modules/
├── react/           ← Container's React
├── zustand/         ← Container's Zustand
└── ...
```

**Workspace Magic:**
```bash
# When you run from root:
npm start

# Lerna translates this to:
cd app1 && npm start &      # Uses app1/node_modules
cd app2 && npm start &      # Uses app2/node_modules  
cd container && npm start & # Uses container/node_modules
```

**Why This Works:**
- **Workspaces** link packages, don't merge dependencies
- **Each app** is self-contained with its own dependencies
- **Root** only provides coordination, not dependencies
- **Lerna** manages the orchestration

### ❓ **Q5: How does data pass between apps in Development vs Production?**

#### **Development (localhost):**
```
Container (localhost:3000)
├── Exposes utils via Module Federation
├── App1 (localhost:3001) imports "container/utils"
└── App2 (localhost:3002) imports "container/utils"

Network Flow:
App1 → HTTP request → localhost:3000/remoteEntry.js → Gets utils
```

#### **Production (different servers):**
```
Container (https://micro-container.netlify.app)
├── Exposes utils via Module Federation
├── App1 (https://micro-app1.netlify.app) imports "container/utils"
└── App2 (https://micro-app2.netlify.app) imports "container/utils"

Network Flow:
App1 → HTTPS request → micro-container.netlify.app/remoteEntry.js → Gets utils
```

**Key Point:** The mechanism is identical - only URLs change!

### ❓ **Q5: What happens if I run only Remote apps without Container?**

**Scenario 1: With Webpack Sharing (Current Setup)**
```bash
cd app1 && npm start  # Without container
```
**Result:** ✅ **Works** - App1 uses its own zustand fallback

**Scenario 2: Pure Sharing (No Fallback)**
```bash
cd app1 && npm start  # Without container, no fallback
```
**Result:** ❌ **Breaks** - Can't find shared dependencies

**Our Solution: Fallback Strategy**
```javascript
// webpack.config.js - All apps have this
shared: {
  zustand: {
    singleton: true,              // Share when container provides it
    requiredVersion: deps.zustand // Use own version as fallback
  }
}

// What happens:
// 1. With Container: Uses shared zustand (1x download)
// 2. Without Container: Uses own zustand (works independently)
```

### ❓ **Q6: How does Module Federation work across different servers?**

**Step-by-step breakdown:**

1. **Build Time:** Each app creates a `remoteEntry.js` manifest
2. **Runtime:** Container fetches remote manifests via HTTP
3. **Dynamic Loading:** Modules loaded on-demand from remote servers

```javascript
// App2 component code
import("container/utils").then((utilsModule) => {
  // This becomes:
  // 1. Fetch https://micro-container.netlify.app/remoteEntry.js
  // 2. Parse federation manifest
  // 3. Load utils module from container server
  // 4. Execute in App2's browser context
});
```

### ❓ **Q7: Why use Zustand sharing with fallback strategy?**

**A:** We use a **hybrid approach** - zustand is installed in all apps but shared when possible:

```bash
# Installation Strategy:
container: npm install zustand  # Provider + fallback
app1: npm install zustand       # Fallback only
app2: npm install zustand       # Fallback only
```

**Scenario 1: Running with Container (Integrated)**
```
🏠 Container loads first
├── Downloads zustand (eager: true)
├── Makes it globally available
└── Starts loading remotes

🚀 App1 & App2 load
├── Check: "Is zustand shared?"
├── ✅ YES - Use container's zustand (singleton)
└── Own zustand installations ignored

Bundle Result:
container.js: 100kb + 50kb zustand = 150kb
app1.js: 80kb (no zustand bundled)
app2.js: 90kb (no zustand bundled)
Total: 320kb (1x zustand, optimal sharing)
```

**Scenario 2: Running Apps Standalone (Development)**
```
🚀 App1 runs alone
├── Check: "Is zustand shared?"
├── ❌ NO - Use own zustand installation
└── ✅ Works independently

Bundle Result:
app1.js: 80kb + 50kb zustand = 130kb
(Uses fallback, works standalone)
```

**Why This Approach:**
- ✅ **Best of both worlds** - sharing when integrated, independence when standalone
- ✅ **Development flexibility** - teams can work independently
- ✅ **Production optimization** - shared bundles in integrated environment
- ✅ **No breaking changes** - apps always work, with or without container

### ❓ **Q8: Wait, if we're sharing zustand, why install it in all apps?**

**A:** This is the **most confusing part** for developers! Here's the truth:

**The Contradiction Explained:**
```bash
# We DO install zustand in all apps:
cd container && npm install zustand
cd app1 && npm install zustand  
cd app2 && npm install zustand

# But webpack sharing makes only container's version load in production
```

**Why Install Everywhere?**

1. **Standalone Development:**
```bash
# This MUST work (without container running):
cd app1 && npm start
# If zustand wasn't installed in app1, this would break
```

2. **Webpack Sharing Logic:**
```javascript
// When container + app1 run together:
// 1. Container loads zustand first (eager: true)
// 2. App1 checks: "Is zustand already loaded?"
// 3. YES - Uses container's version, ignores own installation
// 4. NO - Uses own installation (fallback)
```

3. **Bundle Analysis:**
```
Integrated Mode (container + apps):
✅ Container bundles zustand
❌ App1 skips zustand (uses shared)
❌ App2 skips zustand (uses shared)
Result: 1x zustand download

Standalone Mode (app only):
✅ App1 bundles its own zustand
Result: App works independently
```

**Real-World Analogy:**
```
Think of it like a shared office printer:
- Each team has a backup printer (fallback)
- When in office, everyone uses shared printer (optimal)
- When working from home, use backup printer (independence)
```

**The Magic:** Webpack's `singleton: true` ensures only one zustand instance runs, even if multiple are available.

### ❓ **Q9: What are workspaces and why do we need them?**

```json
"workspaces": {
  "packages": ["app1", "app2", "container"]
}
```

**Workspaces enable:**

1. **Hoisted Dependencies:** Shared packages installed once
2. **Cross-package Linking:** Apps can import from each other
3. **Unified Commands:** Run scripts across all packages
4. **Dependency Management:** Consistent versions across apps

**Example:**
```bash
# Without workspaces
cd app1 && npm install react
cd app2 && npm install react  # Duplicate download
cd container && npm install react  # Duplicate download

# With workspaces
npm install  # Installs react once, links to all apps
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm 7+
- Git

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Micro-frontend
```

2. **Install root dependencies:**
```bash
npm install  # Installs Lerna and workspace tools
```

3. **Install all app dependencies:**
```bash
cd Microfrontend-ModuleFederation-React-Lerna
npm install  # Installs dependencies for all apps via workspaces
```

4. **Start all applications:**
```bash
npm start  # Starts container:3000, app1:3001, app2:3002
```

5. **Open your browser:**
- Container: http://localhost:3000 (main application)
- App1: http://localhost:3001 (standalone)
- App2: http://localhost:3002 (standalone)

### Alternative: Start Individual Apps

```bash
# Start only container
cd container && npm start

# Start only app1
cd app1 && npm start

# Start only app2
cd app2 && npm start
```

## 🔄 Development Workflow

### Daily Development Process

1. **Start Development Environment:**
```bash
npm start  # All apps start in parallel
```

2. **Make Changes:**
```bash
# Edit any file in app1, app2, or container
# Hot reload automatically updates the browser
```

3. **Test Integration:**
- Container (localhost:3000) shows integrated view
- Individual apps (localhost:3001, 3002) for isolated testing

4. **Commit Changes:**
```bash
# From root directory
git add .
git commit -m "Update app1 counter logic"
git push origin main
```

5. **Automatic Deployment:**
- CI/CD detects which apps changed
- Deploys only modified apps
- Container automatically loads updated versions

### Adding New Features

#### **Add New Component to App1:**

1. **Create Component:**
```bash
cd app1/src/components
# Create NewComponent.tsx
```

2. **Expose Component:**
```javascript
// app1/webpack.config.js
exposes: {
  "./CounterAppOne": "./src/components/CounterAppOne",
  "./NewComponent": "./src/components/NewComponent"  // Add this
}
```

3. **Use in Container:**
```javascript
// container/src/App.tsx
const NewComponent = React.lazy(() => import("app1/NewComponent"));

<NewComponent />
```

#### **Add Shared Utility:**

1. **Create Utility:**
```bash
cd container/src/utils
# Add new function to index.ts
```

2. **Use in Remote Apps:**
```javascript
// app1/src/components/CounterAppOne.tsx
import("container/utils").then((utils) => {
  utils.newFunction();  // Available immediately
});
```

## 🌐 Production Deployment

### Deployment Architecture

```
Production Environment:
├── https://micro-container.netlify.app    (Container)
├── https://micro-app1.netlify.app         (App1)
└── https://micro-app2.netlify.app         (App2)

Development Environment:
├── http://localhost:3000                  (Container)
├── http://localhost:3001                  (App1)
└── http://localhost:3002                  (App2)
```

### Environment Configuration

Each app has environment-specific URLs:

**Container .env:**
```bash
DEV_APP1="app1@http://localhost:3001/remoteEntry.js"
DEV_APP2="app2@http://localhost:3002/remoteEntry.js"

PROD_APP1="app1@https://micro-app1.netlify.app/remoteEntry.js"
PROD_APP2="app2@https://micro-app2.netlify.app/remoteEntry.js"
```

**App1 .env:**
```bash
DEV_CONTAINER="container@http://localhost:3000/remoteEntry.js"
PROD_CONTAINER="container@https://micro-container.netlify.app/remoteEntry.js"
```

### CI/CD Pipeline

The pipeline automatically:

1. **Detects Changes:** Only builds modified apps
2. **Runs Quality Checks:** Linting, testing, security scans
3. **Builds Production Bundles:** Optimized for performance
4. **Deploys to Netlify:** Each app to its own URL
5. **Updates Cross-References:** Apps automatically load new versions

**Example Deployment Flow:**
```bash
# Developer commits changes to app1
git add app1/
git commit -m "Update app1 counter"
git push

# CI/CD Pipeline:
✅ Detects: app1 changed
✅ Runs: app1 tests and linting
✅ Builds: app1 production bundle
✅ Deploys: app1 to https://micro-app1.netlify.app
⏸️ Skips: app2 and container (unchanged)

# Result: Container automatically loads new app1 version
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### **1. Module Federation Errors**

**Error:** `Module not found: Can't resolve 'app1/CounterAppOne'`

**Causes & Solutions:**
```bash
# Cause 1: App1 not running
cd app1 && npm start

# Cause 2: Wrong port configuration
# Check app1/.env and container/.env URLs

# Cause 3: CORS issues
# Add CORS headers to netlify.toml

# Cause 4: Build issues
cd app1 && npm run build
```

#### **2. Zustand Sharing Issues**

**Error:** `No required version specified for zustand`

**Solution:**
```bash
# Ensure zustand is in package.json dependencies
cd app1 && npm install zustand
cd app2 && npm install zustand
```

#### **3. Development Server Issues**

**Error:** `Port 3000 already in use`

**Solutions:**
```bash
# Kill all node processes
taskkill /f /im node.exe  # Windows
killall node             # Mac/Linux

# Or use different ports
# Edit webpack.config.js devServer.port
```

#### **4. Build/Deployment Issues**

**Error:** `ChunkLoadError: Loading chunk failed`

**Solutions:**
```bash
# Check network connectivity
curl https://micro-app1.netlify.app/remoteEntry.js

# Verify CORS headers
# Check browser Network tab for 404/CORS errors

# Clear browser cache
Ctrl+Shift+R (hard refresh)
```

#### **5. State Management Issues**

**Problem:** Changes in one app don't reflect in another

**Solutions:**
```javascript
// Ensure using shared zustand store
import { useGlobalStore } from 'container/globalStore';

// Check singleton configuration
shared: {
  zustand: { singleton: true }
}
```

### Debug Commands

```bash
# Check if all apps are running
curl http://localhost:3000  # Container
curl http://localhost:3001  # App1
curl http://localhost:3002  # App2

# Check production deployments
curl https://micro-container.netlify.app/remoteEntry.js
curl https://micro-app1.netlify.app/remoteEntry.js
curl https://micro-app2.netlify.app/remoteEntry.js

# Build all apps locally
npm run build

# Test production builds locally
cd container && npm run serve
cd app1 && npm run serve
cd app2 && npm run serve
```

### Performance Optimization

#### **Bundle Analysis:**
```bash
# Analyze bundle sizes
cd app1 && npm run bundle-analyzer
cd app2 && npm run bundle-analyzer
cd container && npm run bundle-analyzer
```

#### **Optimization Tips:**
1. **Lazy Loading:** Use React.lazy for remote components
2. **Code Splitting:** Split large components into smaller chunks
3. **Shared Dependencies:** Maximize webpack sharing
4. **Caching:** Configure proper cache headers
5. **Compression:** Enable gzip/brotli compression

## 📚 Additional Resources

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Micro-frontends.org](https://micro-frontends.org/)
- [Lerna Documentation](https://lerna.js.org/)
- [Netlify Deployment Guide](https://docs.netlify.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m "Add new feature"`
5. Push to branch: `git push origin feature/new-feature`
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding! 🚀** If you have questions, check the troubleshooting section or open an issue.