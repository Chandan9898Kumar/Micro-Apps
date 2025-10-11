# 🚀 Micro-Frontend Architecture with Module Federation

A comprehensive implementation of micro-frontend architecture using **Webpack Module Federation**, **React**, **TypeScript**, and **Lerna** for monorepo management.

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Sharing Strategy](#data-sharing-strategy)
- [Lerna Monorepo Management](#lerna-monorepo-management)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [How It Works](#how-it-works)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project demonstrates a **micro-frontend architecture** where multiple independent React applications work together as a unified system. Each micro-frontend can be developed, tested, and deployed independently while sharing components and state seamlessly.

### Key Features
- ✅ **Independent Development**: Each app can be developed separately
- ✅ **Shared State Management**: Global state synchronization across micro-frontends
- ✅ **Module Federation**: Runtime component sharing without build-time dependencies
- ✅ **Monorepo Management**: Unified development experience with Lerna
- ✅ **TypeScript Support**: Full type safety across all applications
- ✅ **Hot Module Replacement**: Fast development with instant updates

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTAINER APP (Port 3000)                │
│  ┌─────────────────┐              ┌─────────────────┐       │
│  │   APP-1 Remote  │              │   APP-2 Remote  │       │
│  │  (Port 3001)    │              │  (Port 3002)    │       │
│  │                 │              │                 │       │
│  │ CounterAppOne   │              │ CounterAppTwo   │       │
│  │ Component       │              │ Component       │       │
│  └─────────────────┘              └─────────────────┘       │
│                                                             │
│  Global State: window.globalMicroState                      │
│  { app1: number, app2: number }                             │
└─────────────────────────────────────────────────────────────┘
```

### Application Roles

| Application | Port | Role | Exposes | Consumes |
|-------------|------|------|---------|----------|
| **Container** | 3000 | Host/Shell | - | CounterAppOne, CounterAppTwo |
| **App1** | 3001 | Remote | CounterAppOne | - |
| **App2** | 3002 | Remote | CounterAppTwo | - |

## 🛠️ Tech Stack

### Core Technologies
- **React 17.0.2**: Frontend library for building user interfaces
- **TypeScript 4.2.4**: Type-safe JavaScript with static type checking
- **Webpack 5.67.0**: Module bundler with Module Federation plugin
- **Lerna 3.22.1**: Monorepo management tool

### Development Tools
- **Webpack Dev Server**: Development server with hot reloading
- **Babel**: JavaScript transpiler for modern syntax support
- **Fork TS Checker**: TypeScript type checking in separate process

### Module Federation
- **Webpack Module Federation**: Runtime code sharing between applications
- **Dynamic Imports**: Lazy loading of remote components
- **Shared Dependencies**: React and React-DOM shared as singletons

## 📁 Project Structure

```
Microfrontend-ModuleFederation-React-Lerna/
├── 📦 container/                 # Host application (Port 3000)
│   ├── src/
│   │   ├── App.tsx              # Main container component
│   │   ├── bootstrap.tsx        # App initialization
│   │   └── index.ts             # Entry point
│   ├── webpack.config.js        # Webpack configuration
│   └── package.json             # Dependencies & scripts
│
├── 📦 app1/                     # Remote application 1 (Port 3001)
│   ├── src/
│   │   ├── components/
│   │   │   └── CounterAppOne.tsx # Exposed component
│   │   ├── App.tsx              # Standalone app
│   │   └── index.ts             # Entry point
│   ├── webpack.config.js        # Module Federation config
│   └── package.json             # Dependencies & scripts
│
├── 📦 app2/                     # Remote application 2 (Port 3002)
│   ├── src/
│   │   ├── components/
│   │   │   └── CounterAppTwo.tsx # Exposed component
│   │   ├── App.tsx              # Standalone app
│   │   └── index.ts             # Entry point
│   ├── webpack.config.js        # Module Federation config
│   └── package.json             # Dependencies & scripts
│
├── 📄 lerna.json               # Lerna configuration
├── 📄 package.json             # Root package.json
└── 📄 README.md                # This file
```

## 🔄 Data Sharing Strategy

### Global State Management
The application uses a **global window object** approach for cross-micro-frontend state sharing:

```typescript
// Global state interface
interface GlobalState {
  app1: number;  // Counter value for App1
  app2: number;  // Counter value for App2
}

// Initialize global state
if (!window.globalMicroState) {
  window.globalMicroState = { app1: 0, app2: 1 };
}
```

### State Synchronization Process

1. **Initialization**: Each component reads initial state from `window.globalMicroState`
2. **Updates**: When a user clicks a button, the component:
   - Updates local React state
   - Updates global window state
   - Triggers re-render in all listening components
3. **Polling**: Components poll global state every 100ms to detect changes
4. **Real-time Sync**: Changes in one micro-frontend instantly reflect in others

### Why This Approach?

| Approach | Pros | Cons | Used? |
|----------|------|------|-------|
| **localStorage** | Persistent | Domain-specific (localhost:3000 ≠ localhost:3001) | ❌ |
| **postMessage** | Cross-origin | Complex setup, iframe-based | ❌ |
| **URL Parameters** | Shareable | Manual copying required | ❌ |
| **Global Window** | Simple, same context | Only works in Module Federation | ✅ |

## 📚 Lerna Monorepo Management

### What is Lerna?

**Lerna** is a tool for managing JavaScript projects with multiple packages (monorepo). It optimizes the workflow around managing multi-package repositories.

### Why We Need Lerna

#### Without Lerna (Problems):
```bash
# You'd need to run each app separately
cd container && npm start &
cd app1 && npm start &
cd app2 && npm start &
```

#### With Lerna (Solution):
```bash
# Single command starts all apps
npm start  # Runs all 3 apps in parallel
```

### How Lerna Works

1. **Dependency Management**: 
   - Hoists common dependencies to root
   - Reduces duplicate installations
   - Manages inter-package dependencies

2. **Script Orchestration**:
   ```json
   {
     "scripts": {
       "start": "lerna run --parallel start",
       "build": "lerna run build",
       "clean": "lerna run --parallel clean"
     }
   }
   ```

3. **Workspace Configuration**:
   ```json
   {
     "workspaces": {
       "packages": ["app1", "app2", "container"]
     }
   }
   ```

### Lerna Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `lerna bootstrap` | Install dependencies for all packages | Initial setup |
| `lerna run start` | Run start script in all packages | Development |
| `lerna run --parallel start` | Run start scripts in parallel | Faster development |
| `lerna clean` | Remove node_modules from all packages | Cleanup |
| `lerna version` | Version all packages | Release management |

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js**: Version 14+ 
- **npm**: Version 6+
- **Git**: For version control

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Chandan9898Kumar/Micro-Apps.git
   cd Microfrontend-ModuleFederation-React-Lerna
   ```

2. **Install Root Dependencies**
   ```bash
   npm install
   ```
   This installs Lerna and sets up the monorepo structure.

3. **Bootstrap All Packages** (Optional - Lerna handles this automatically)
   ```bash
   npx lerna bootstrap
   ```

4. **Verify Installation**
   ```bash
   npx lerna list
   ```
   Should show: `container`, `app1`, `app2`

## 🚀 Running the Project

### Option 1: Start All Applications (Recommended)
```bash
npm start
```
This command:
- Starts all 3 applications in parallel
- Opens browser automatically
- Enables hot module replacement

**Access URLs:**
- 🏠 **Container**: http://localhost:3000 (Main application)
- 🎯 **App1**: http://localhost:3001 (Standalone Counter App 1)
- ⚡ **App2**: http://localhost:3002 (Standalone Counter App 2)

### Option 2: Start Individual Applications
```bash
# Terminal 1 - Container
cd container && npm start

# Terminal 2 - App1  
cd app1 && npm start

# Terminal 3 - App2
cd app2 && npm start
```

### Option 3: Development Commands
```bash
# Build all applications
npm run build

# Clean all node_modules
npm run clean

# Serve built applications
npm run serve
```

## 🔧 How It Works

### Module Federation Configuration

#### Container (Host) Configuration:
```javascript
new ModuleFederationPlugin({
  name: "container",
  remotes: {
    app1: "app1@http://localhost:3001/remoteEntry.js",
    app2: "app2@http://localhost:3002/remoteEntry.js",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
})
```

#### Remote App Configuration:
```javascript
new ModuleFederationPlugin({
  name: "app1",
  filename: "remoteEntry.js",
  exposes: {
    "./CounterAppOne": "./src/components/CounterAppOne",
  },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
})
```

### Component Loading Process

1. **Container Starts**: Loads at http://localhost:3000
2. **Dynamic Imports**: Container dynamically imports remote components:
   ```typescript
   const CounterAppOne = React.lazy(() => import("app1/CounterAppOne"));
   const CounterAppTwo = React.lazy(() => import("app2/CounterAppTwo"));
   ```
3. **Runtime Resolution**: Webpack fetches components from remote URLs
4. **Shared Dependencies**: React/ReactDOM shared as singletons
5. **State Synchronization**: Global state keeps all components in sync

### State Flow Diagram

```
User clicks button in Container
         ↓
Local state updates (setCount)
         ↓
Global state updates (window.globalMicroState)
         ↓
Polling detects change (100ms interval)
         ↓
All components re-render with new state
         ↓
UI updates across all micro-frontends
```

## 🔄 Development Workflow

### Adding a New Micro-Frontend

1. **Create New Package**:
   ```bash
   mkdir app3
   cd app3
   npm init -y
   ```

2. **Add to Lerna Workspaces**:
   ```json
   // Root package.json
   {
     "workspaces": {
       "packages": ["app1", "app2", "container", "app3"]
     }
   }
   ```

3. **Configure Module Federation**:
   ```javascript
   // app3/webpack.config.js
   new ModuleFederationPlugin({
     name: "app3",
     filename: "remoteEntry.js",
     exposes: {
       "./CounterAppThree": "./src/components/CounterAppThree",
     },
   })
   ```

4. **Update Container**:
   ```javascript
   // container/webpack.config.js
   remotes: {
     app1: "app1@http://localhost:3001/remoteEntry.js",
     app2: "app2@http://localhost:3002/remoteEntry.js",
     app3: "app3@http://localhost:3003/remoteEntry.js", // Add this
   }
   ```

### Best Practices

1. **State Management**: Use global state for shared data, local state for component-specific data
2. **Error Boundaries**: Wrap remote components in error boundaries
3. **Loading States**: Always provide fallback components for lazy-loaded remotes
4. **Type Safety**: Share TypeScript interfaces between micro-frontends
5. **Testing**: Test each micro-frontend independently and integration scenarios

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "webpack is not recognized"
**Problem**: Missing webpack installation
```bash
# Solution
npm install  # Install root dependencies first
```

#### 2. "Module not found: Can't resolve 'app1/CounterAppOne'"
**Problem**: Remote application not running
```bash
# Solution
npm start  # Ensure all apps are running
```

#### 3. "Uncaught ChunkLoadError"
**Problem**: Remote entry point not accessible
```bash
# Check if remotes are running:
curl http://localhost:3001/remoteEntry.js
curl http://localhost:3002/remoteEntry.js
```

#### 4. State not syncing between apps
**Problem**: Global state not initialized
```typescript
// Solution: Ensure global state is initialized in each component
if (!window.globalMicroState) {
  window.globalMicroState = { app1: 0, app2: 1 };
}
```

#### 5. "lerna: command not found"
**Problem**: Lerna not installed globally
```bash
# Solution 1: Install globally
npm install -g lerna

# Solution 2: Use npx
npx lerna bootstrap
```

### Performance Optimization

1. **Shared Dependencies**: Ensure React is shared as singleton
2. **Code Splitting**: Use React.lazy for remote components
3. **Caching**: Configure webpack caching for faster builds
4. **Bundle Analysis**: Use webpack-bundle-analyzer to optimize bundles

### Debugging Tips

1. **Network Tab**: Check if remote entries are loading correctly
2. **Console Logs**: Add logging to track state changes
3. **React DevTools**: Debug component state and props
4. **Webpack Stats**: Analyze bundle composition and dependencies

## 📈 Production Considerations

### Deployment Strategy
1. **Independent Deployment**: Each micro-frontend can be deployed separately
2. **CDN Distribution**: Host remote entries on CDN for better performance
3. **Version Management**: Use semantic versioning for micro-frontend releases
4. **Rollback Strategy**: Maintain multiple versions for quick rollbacks

### Security
1. **CORS Configuration**: Properly configure cross-origin requests
2. **Content Security Policy**: Set appropriate CSP headers
3. **Dependency Scanning**: Regular security audits of dependencies

### Monitoring
1. **Error Tracking**: Monitor micro-frontend errors separately
2. **Performance Metrics**: Track loading times and bundle sizes
3. **User Analytics**: Measure user interactions across micro-frontends

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Lerna Documentation](https://lerna.js.org/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Happy Coding! 🚀**