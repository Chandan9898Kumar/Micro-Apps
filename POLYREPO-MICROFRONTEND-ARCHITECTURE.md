# 🏗️ Polyrepo Micro-Frontend Architecture Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Monorepo vs Polyrepo](#monorepo-vs-polyrepo)
- [Polyrepo Architecture](#polyrepo-architecture)
- [GitHub Repository Structure](#github-repository-structure)
- [Team Workflow](#team-workflow)
- [Deployment Strategy](#deployment-strategy)
- [Module Federation & Integration](#module-federation--integration)
- [Data Sharing Between Micro-Frontends](#data-sharing-between-micro-frontends)
- [Multi-Framework Support](#multi-framework-support)
- [Pros and Cons](#pros-and-cons)
- [Implementation Examples](#implementation-examples)

## 🎯 Overview

This guide explains how to transition from a **monorepo** to a **polyrepo** architecture for micro-frontends, where each team owns independent repositories while maintaining seamless integration.

### Current State (Monorepo)
```
Micro-frontend/                    ← Single Repository
├── .git/
├── container/                     ← Host Application
├── app1/                         ← Team A's Micro-frontend
├── app2/                         ← Team B's Micro-frontend
└── package.json                  ← Shared workspace
```

### Target State (Polyrepo)
```
micro-container-repo/             ← Repository 1 (Platform Team)
├── .git/
└── container/

micro-shopping-cart-repo/         ← Repository 2 (Team A)
├── .git/
└── shopping-cart-app/

micro-user-profile-repo/          ← Repository 3 (Team B)
├── .git/
└── user-profile-app/

micro-product-catalog-repo/       ← Repository 4 (Team C)
├── .git/
└── product-catalog-app/
```

## 🔄 Monorepo vs Polyrepo

| Aspect | Monorepo | Polyrepo |
|--------|----------|----------|
| **Repository Structure** | Single repo, multiple apps | Multiple repos, one app each |
| **Team Independence** | Shared codebase, coordinated releases | Complete autonomy, independent releases |
| **CI/CD Complexity** | Single pipeline, change detection | Multiple pipelines, simpler per-repo |
| **Dependency Management** | Shared dependencies, version conflicts | Independent dependencies, no conflicts |
| **Code Sharing** | Easy sharing via workspace | Requires npm packages or federation |
| **Deployment** | Coordinated deployment | Independent deployment |
| **Scaling** | Limited by single repo size | Unlimited horizontal scaling |

## 🏛️ Polyrepo Architecture

### Repository Structure

#### 1. Container Repository (Platform Team)
```
micro-container-repo/
├── .github/workflows/
│   └── deploy-container.yml
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   └── ErrorBoundary.tsx
│   ├── store/
│   │   └── globalStore.ts          ← Global state management
│   ├── utils/
│   │   ├── moduleRegistry.ts       ← Dynamic module loading
│   │   └── eventBus.ts            ← Inter-app communication
│   ├── App.tsx
│   └── index.tsx
├── webpack.config.js               ← Module Federation Host
├── package.json
└── README.md
```

#### 2. Micro-Frontend Repository (Each Team)
```
micro-shopping-cart-repo/
├── .github/workflows/
│   └── deploy-shopping-cart.yml
├── src/
│   ├── components/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── ShoppingCart.tsx        ← Main exposed component
│   ├── store/
│   │   └── cartStore.ts            ← Local state management
│   ├── services/
│   │   └── cartAPI.ts
│   ├── types/
│   │   └── cart.types.ts
│   └── index.tsx                   ← Entry point
├── webpack.config.js               ← Module Federation Remote
├── package.json
└── README.md
```

## 🐙 GitHub Repository Structure

### Organization Structure
```
YourCompany-MicroFrontends/
├── micro-container                 ← Platform Team Repository
├── micro-shopping-cart            ← Team A Repository
├── micro-user-profile             ← Team B Repository
├── micro-product-catalog          ← Team C Repository
├── micro-shared-components        ← Shared UI Library
└── micro-deployment-configs       ← Infrastructure Repository
```

### Repository Naming Convention
- **Container**: `micro-container` or `micro-shell`
- **Business Domains**: `micro-{domain-name}`
  - `micro-shopping-cart`
  - `micro-user-profile`
  - `micro-product-catalog`
  - `micro-payment-gateway`
- **Shared Libraries**: `micro-shared-{purpose}`
  - `micro-shared-components`
  - `micro-shared-utils`

### Branch Strategy (Per Repository)
```
main                               ← Production branch
├── develop                        ← Integration branch
├── feature/cart-optimization      ← Feature branches
├── hotfix/cart-bug-fix           ← Hotfix branches
└── release/v2.1.0                ← Release branches
```

## 👥 Team Workflow

### Team Structure Example

#### Team A: Shopping Cart (React + TypeScript)
```
Repository: micro-shopping-cart
Framework: React 18 + TypeScript
State: Zustand
Styling: Styled Components
Team Size: 4 developers
```

#### Team B: User Profile (Vue.js + TypeScript)
```
Repository: micro-user-profile
Framework: Vue 3 + TypeScript
State: Pinia
Styling: Tailwind CSS
Team Size: 3 developers
```

#### Team C: Product Catalog (Angular + TypeScript)
```
Repository: micro-product-catalog
Framework: Angular 15 + TypeScript
State: NgRx
Styling: Angular Material
Team Size: 5 developers
```

### Daily Development Workflow

#### 1. Independent Development
```bash
# Team A works on shopping cart
git clone https://github.com/company/micro-shopping-cart.git
cd micro-shopping-cart
npm install
npm start                          # Runs on port 3001

# Team B works on user profile
git clone https://github.com/company/micro-user-profile.git
cd micro-user-profile
npm install
npm run dev                        # Runs on port 3002

# Platform team works on container
git clone https://github.com/company/micro-container.git
cd micro-container
npm install
npm start                          # Runs on port 3000
```

#### 2. Integration Testing
```bash
# Container loads remote modules
# webpack.config.js in container
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        shoppingCart: 'shoppingCart@http://localhost:3001/remoteEntry.js',
        userProfile: 'userProfile@http://localhost:3002/remoteEntry.js',
        productCatalog: 'productCatalog@http://localhost:3003/remoteEntry.js'
      }
    })
  ]
};
```

#### 3. Release Process
```bash
# Each team releases independently
# Team A releases shopping cart
cd micro-shopping-cart
git tag v1.2.3
git push origin v1.2.3
# Triggers CI/CD → Deploys to https://shopping-cart.company.com

# Container updates remote URLs
# webpack.config.js in container (production)
remotes: {
  shoppingCart: 'shoppingCart@https://shopping-cart.company.com/remoteEntry.js'
}
```

## 🚀 Deployment Strategy

### Infrastructure Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     CDN / Load Balancer                     │
├─────────────────────────────────────────────────────────────┤
│  Container App          │  Micro-Frontend Apps              │
│  https://app.company.com│  https://cart.company.com         │
│                         │  https://profile.company.com      │
│                         │  https://catalog.company.com      │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Pipeline (Per Repository)

#### Container Deployment
```yaml
# .github/workflows/deploy-container.yml
name: Deploy Container
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_SHOPPING_CART_URL: https://cart.company.com
          REACT_APP_USER_PROFILE_URL: https://profile.company.com
          REACT_APP_PRODUCT_CATALOG_URL: https://catalog.company.com
      
      - name: Deploy to AWS S3
        run: aws s3 sync dist/ s3://container-app-bucket
      
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }}
```

#### Micro-Frontend Deployment
```yaml
# .github/workflows/deploy-shopping-cart.yml
name: Deploy Shopping Cart
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to AWS S3
        run: aws s3 sync dist/ s3://shopping-cart-app-bucket
      
      - name: Notify container of new version
        run: |
          curl -X POST https://api.company.com/micro-frontend/update \
            -H "Content-Type: application/json" \
            -d '{"service": "shoppingCart", "version": "${{ github.sha }}"}'
```

## 🔗 Module Federation & Integration

### Container Configuration (Host)
```javascript
// webpack.config.js in container
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        shoppingCart: 'shoppingCart@https://cart.company.com/remoteEntry.js',
        userProfile: 'userProfile@https://profile.company.com/remoteEntry.js',
        productCatalog: 'productCatalog@https://catalog.company.com/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true }
      }
    })
  ]
};
```

### Container App Integration
```tsx
// src/App.tsx in container
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Dynamic imports for micro-frontends
const ShoppingCart = React.lazy(() => import('shoppingCart/ShoppingCart'));
const UserProfile = React.lazy(() => import('userProfile/UserProfile'));
const ProductCatalog = React.lazy(() => import('productCatalog/ProductCatalog'));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route 
              path="/cart/*" 
              element={
                <Suspense fallback={<div>Loading Cart...</div>}>
                  <ShoppingCart />
                </Suspense>
              } 
            />
            <Route 
              path="/profile/*" 
              element={
                <Suspense fallback={<div>Loading Profile...</div>}>
                  <UserProfile />
                </Suspense>
              } 
            />
            <Route 
              path="/catalog/*" 
              element={
                <Suspense fallback={<div>Loading Catalog...</div>}>
                  <ProductCatalog />
                </Suspense>
              } 
            />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

### Micro-Frontend Configuration (Remote)
```javascript
// webpack.config.js in shopping-cart
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shoppingCart',
      filename: 'remoteEntry.js',
      exposes: {
        './ShoppingCart': './src/components/ShoppingCart',
        './CartWidget': './src/components/CartWidget'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

## 📡 Data Sharing Between Micro-Frontends

### 1. Event Bus Communication
```typescript
// utils/eventBus.ts in container
class EventBus {
  private events: { [key: string]: Function[] } = {};

  subscribe(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, data: any) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  unsubscribe(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export const eventBus = new EventBus();

// Make it globally available
(window as any).eventBus = eventBus;
```

### 2. Global State Management
```typescript
// store/globalStore.ts in container
import { create } from 'zustand';

interface GlobalState {
  user: User | null;
  cartItems: CartItem[];
  theme: 'light' | 'dark';
  setUser: (user: User) => void;
  addToCart: (item: CartItem) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  cartItems: [],
  theme: 'light',
  setUser: (user) => set({ user }),
  addToCart: (item) => set((state) => ({ 
    cartItems: [...state.cartItems, item] 
  })),
  setTheme: (theme) => set({ theme })
}));

// Make it globally available
(window as any).globalStore = useGlobalStore;
```

### 3. Cross-App Communication Examples

#### Shopping Cart → User Profile
```typescript
// In shopping-cart micro-frontend
import { eventBus } from 'container/eventBus';

const addToCart = (product: Product) => {
  // Add to local cart
  cartStore.addItem(product);
  
  // Notify other micro-frontends
  eventBus.emit('cart:item-added', {
    productId: product.id,
    quantity: 1,
    userId: globalStore.getState().user?.id
  });
};
```

#### User Profile → Shopping Cart
```typescript
// In user-profile micro-frontend
import { eventBus } from 'container/eventBus';

useEffect(() => {
  // Listen for cart updates
  const handleCartUpdate = (data: any) => {
    // Update user's recent activity
    userStore.addActivity({
      type: 'cart_addition',
      productId: data.productId,
      timestamp: new Date()
    });
  };

  eventBus.subscribe('cart:item-added', handleCartUpdate);
  
  return () => {
    eventBus.unsubscribe('cart:item-added', handleCartUpdate);
  };
}, []);
```

### 4. Shared API Layer
```typescript
// Create shared API package: @company/shared-api
// Published to npm registry

// packages/shared-api/src/userAPI.ts
export class UserAPI {
  private baseURL = process.env.REACT_APP_API_URL;

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/${id}`);
    return response.json();
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const userAPI = new UserAPI();
```

## 🎨 Multi-Framework Support

### Framework Integration Matrix

| Container | Remote 1 | Remote 2 | Remote 3 | Compatibility |
|-----------|----------|----------|----------|---------------|
| React 18 | React 18 | Vue 3 | Angular 15 | ✅ Full Support |
| React 18 | React 17 | React 18 | Svelte | ⚠️ Version Conflicts |
| Vue 3 | React 18 | Vue 3 | Angular 15 | ✅ Full Support |

### React + Vue Integration Example

#### Container (React)
```tsx
// Container loads Vue micro-frontend
const VueUserProfile = React.lazy(() => import('userProfile/VueApp'));

function App() {
  return (
    <div>
      <h1>React Container</h1>
      <Suspense fallback={<div>Loading Vue App...</div>}>
        <VueUserProfile />
      </Suspense>
    </div>
  );
}
```

#### Vue Micro-Frontend
```javascript
// webpack.config.js in Vue micro-frontend
const ModuleFederationPlugin = require('@module-federation/webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'userProfile',
      filename: 'remoteEntry.js',
      exposes: {
        './VueApp': './src/components/UserProfileWrapper.js'
      }
    })
  ]
};
```

```javascript
// src/components/UserProfileWrapper.js
import { createApp } from 'vue';
import UserProfile from './UserProfile.vue';

export default {
  mount(element) {
    const app = createApp(UserProfile);
    app.mount(element);
    return app;
  },
  unmount(app) {
    app.unmount();
  }
};
```

### Angular Integration Example
```typescript
// Angular micro-frontend wrapper
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { ProductCatalogComponent } from './product-catalog.component';

export default {
  async mount(element: HTMLElement) {
    const app = await createApplication();
    const productCatalogElement = createCustomElement(ProductCatalogComponent, { injector: app.injector });
    customElements.define('product-catalog', productCatalogElement);
    
    element.innerHTML = '<product-catalog></product-catalog>';
  }
};
```

## ⚖️ Pros and Cons

### ✅ Polyrepo Advantages

#### Team Independence
- **Autonomous Development**: Teams work independently without coordination overhead
- **Technology Freedom**: Each team can choose their preferred framework/tools
- **Release Cycles**: Independent deployment schedules
- **Ownership**: Clear boundaries and responsibilities

#### Scalability
- **Horizontal Scaling**: Add new teams/repositories without affecting existing ones
- **Performance**: Smaller repositories, faster CI/CD pipelines
- **Parallel Development**: Multiple teams can work simultaneously without conflicts

#### Risk Management
- **Fault Isolation**: Issues in one micro-frontend don't affect others
- **Rollback Safety**: Independent rollbacks without affecting other services
- **Security**: Isolated codebases reduce attack surface

### ❌ Polyrepo Disadvantages

#### Complexity
- **Infrastructure Overhead**: Multiple repositories, CI/CD pipelines, deployments
- **Coordination Challenges**: Cross-team changes require more planning
- **Dependency Management**: Shared libraries need versioning strategy

#### Development Experience
- **Local Development**: More complex setup to run full application
- **Debugging**: Cross-app issues harder to trace
- **Code Sharing**: Requires npm packages or federation for shared code

#### Operational Overhead
- **Monitoring**: Need to monitor multiple services
- **Logging**: Distributed logging across multiple applications
- **Version Management**: Keeping track of compatible versions

### 📊 Decision Matrix

| Factor | Monorepo Score | Polyrepo Score | Winner |
|--------|----------------|----------------|---------|
| Team Independence | 3/10 | 9/10 | Polyrepo |
| Development Speed | 8/10 | 6/10 | Monorepo |
| Scalability | 5/10 | 9/10 | Polyrepo |
| Code Sharing | 9/10 | 4/10 | Monorepo |
| CI/CD Complexity | 7/10 | 5/10 | Monorepo |
| Deployment Risk | 4/10 | 8/10 | Polyrepo |
| Operational Overhead | 8/10 | 4/10 | Monorepo |

**Recommendation**: Choose **Polyrepo** when:
- Teams are large (5+ developers per team)
- Different technology stacks are required
- Independent release cycles are critical
- Long-term scalability is priority

Choose **Monorepo** when:
- Small teams (2-4 developers total)
- Shared technology stack
- Coordinated releases are acceptable
- Simplicity is priority

## 🛠️ Implementation Examples

### Complete Setup Guide

#### 1. Create Container Repository
```bash
# Create container repository
mkdir micro-container && cd micro-container
git init
npm init -y

# Install dependencies
npm install react react-dom react-router-dom
npm install -D webpack webpack-cli webpack-dev-server @module-federation/webpack
npm install -D typescript @types/react @types/react-dom

# Create webpack config
cat > webpack.config.js << 'EOF'
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        shoppingCart: 'shoppingCart@http://localhost:3001/remoteEntry.js',
        userProfile: 'userProfile@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true }
      }
    })
  ]
};
EOF

# Create basic app structure
mkdir -p src/components src/store src/utils
```

#### 2. Create Shopping Cart Repository
```bash
# Create shopping cart repository
mkdir micro-shopping-cart && cd micro-shopping-cart
git init
npm init -y

# Install dependencies
npm install react react-dom zustand
npm install -D webpack webpack-cli webpack-dev-server @module-federation/webpack

# Create webpack config
cat > webpack.config.js << 'EOF'
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3001
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shoppingCart',
      filename: 'remoteEntry.js',
      exposes: {
        './ShoppingCart': './src/components/ShoppingCart'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
EOF
```

#### 3. Create User Profile Repository (Vue.js)
```bash
# Create user profile repository
mkdir micro-user-profile && cd micro-user-profile
git init
npm init -y

# Install Vue dependencies
npm install vue@next pinia
npm install -D webpack webpack-cli webpack-dev-server @module-federation/webpack
npm install -D vue-loader @vue/compiler-sfc

# Create webpack config for Vue
cat > webpack.config.js << 'EOF'
const ModuleFederationPlugin = require('@module-federation/webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3002
  },
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'userProfile',
      filename: 'remoteEntry.js',
      exposes: {
        './UserProfile': './src/components/UserProfileWrapper.js'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
};
EOF
```

### Data Flow Example

#### Scenario: User adds item to cart, profile shows recent activity

```typescript
// 1. Shopping Cart Component (React)
import React from 'react';
import { eventBus } from '../utils/eventBus';

const ShoppingCart: React.FC = () => {
  const addToCart = (product: Product) => {
    // Add to local store
    cartStore.addItem(product);
    
    // Emit event for other micro-frontends
    eventBus.emit('cart:item-added', {
      productId: product.id,
      productName: product.name,
      price: product.price,
      timestamp: new Date().toISOString(),
      userId: globalStore.getState().user?.id
    });
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {/* Cart UI */}
    </div>
  );
};

export default ShoppingCart;
```

```vue
<!-- 2. User Profile Component (Vue.js) -->
<template>
  <div>
    <h2>User Profile</h2>
    <div class="recent-activity">
      <h3>Recent Activity</h3>
      <ul>
        <li v-for="activity in recentActivities" :key="activity.id">
          {{ activity.description }} - {{ activity.timestamp }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const recentActivities = ref([]);

const handleCartUpdate = (data: any) => {
  recentActivities.value.unshift({
    id: Date.now(),
    description: `Added ${data.productName} to cart`,
    timestamp: new Date(data.timestamp).toLocaleString()
  });
  
  // Keep only last 10 activities
  if (recentActivities.value.length > 10) {
    recentActivities.value.pop();
  }
};

onMounted(() => {
  // Subscribe to cart events
  window.eventBus?.subscribe('cart:item-added', handleCartUpdate);
});

onUnmounted(() => {
  // Cleanup subscription
  window.eventBus?.unsubscribe('cart:item-added', handleCartUpdate);
});
</script>
```

## 🚀 Getting Started Checklist

### Phase 1: Repository Setup
- [ ] Create GitHub organization/repositories
- [ ] Set up CI/CD pipelines for each repository
- [ ] Configure deployment environments
- [ ] Set up monitoring and logging

### Phase 2: Container Development
- [ ] Create container application with Module Federation
- [ ] Implement global state management
- [ ] Set up event bus for communication
- [ ] Create shared component library

### Phase 3: Micro-Frontend Migration
- [ ] Extract first micro-frontend to separate repository
- [ ] Configure Module Federation for remote loading
- [ ] Test integration with container
- [ ] Migrate remaining micro-frontends

### Phase 4: Team Onboarding
- [ ] Train teams on polyrepo workflow
- [ ] Document communication patterns
- [ ] Set up development environments
- [ ] Establish release processes

### Phase 5: Production Deployment
- [ ] Deploy container and micro-frontends
- [ ] Monitor performance and errors
- [ ] Optimize loading strategies
- [ ] Implement feature flags

## 📚 Additional Resources

- [Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontend Architecture Patterns](https://martinfowler.com/articles/micro-frontends.html)
- [Event-Driven Architecture Guide](https://microservices.io/patterns/data/event-driven-architecture.html)
- [Polyrepo vs Monorepo Decision Guide](https://github.com/joelparkerhenderson/monorepo-vs-polyrepo)

---

**Next Steps**: Start with Phase 1 and gradually migrate your existing monorepo to polyrepo architecture. Begin with the least critical micro-frontend to minimize risk.



###  🚀 Polyrepo Deployment & Running Guide.

## 🎯 Simple Overview

**Key Point**: In polyrepo, each app runs and deploys independently. The host loads micro-apps from their deployed URLs.

```
Host App (Port 3000) → Loads Remote Apps from URLs
├── Shopping Cart (Port 3001) → https://cart.company.com
├── User Profile (Port 3002) → https://profile.company.com  
└── Product Catalog (Port 3003) → https://catalog.company.com
```

## 🏃‍♂️ How to Run Applications

### Development Mode (Local)

#### 1. Run Host Application
```bash
# Clone and run host
git clone https://github.com/company/micro-container.git
cd micro-container
npm install
npm start                    # Runs on http://localhost:3000
```

**❌ NO - Host alone won't show micro-apps**
- Host will show loading states or errors
- You need to run micro-apps separately

#### 2. Run Each Micro-App Separately
```bash
# Terminal 1 - Shopping Cart
git clone https://github.com/company/micro-shopping-cart.git
cd micro-shopping-cart
npm install
npm start                    # Runs on http://localhost:3001

# Terminal 2 - User Profile  
git clone https://github.com/company/micro-user-profile.git
cd micro-user-profile
npm install
npm start                    # Runs on http://localhost:3002

# Terminal 3 - Product Catalog
git clone https://github.com/company/micro-product-catalog.git
cd micro-product-catalog
npm install
npm start                    # Runs on http://localhost:3003
```

# 🤔 Why Run Micro-Apps Separately in Polyrepo ? (Explained Simply)

## 🎯 The Confusion

**Your Question**: "Why can't I run all apps when I run only the host app?"

**Answer**: You CAN, but it depends on HOW you set up your polyrepo architecture.

## 🔄 Two Different Approaches

### Approach 1: True Polyrepo (Separate Repositories)
```
GitHub:
├── micro-container (Repository 1)
├── micro-shopping-cart (Repository 2) 
├── micro-user-profile (Repository 3)
└── micro-product-catalog (Repository 4)

Local Development:
├── /projects/micro-container/
├── /projects/micro-shopping-cart/
├── /projects/micro-user-profile/
└── /projects/micro-product-catalog/
```

**Result**: You MUST run each app separately because they're in different folders/repos.

### Approach 2: Polyrepo Structure in Monorepo
```
GitHub:
└── micro-frontend-project (Single Repository)
    ├── micro-container/
    ├── micro-shopping-cart/
    ├── micro-user-profile/
    ├── micro-product-catalog/
    └── package.json (root workspace)
```

**Result**: You CAN run all apps from root with one command.

## 🛠️ Implementation Examples

### True Polyrepo (Separate Running Required)

#### Host Repository
```bash
# Repository: micro-container
git clone https://github.com/company/micro-container.git
cd micro-container
npm start                    # Only runs host on port 3000
```

#### What Host Sees
```javascript
// Host tries to load from localhost:3001
remotes: {
  shoppingCart: 'shoppingCart@http://localhost:3001/remoteEntry.js'
}

// ❌ ERROR: Connection refused (nothing running on 3001)
```

#### Solution: Run Each App
```bash
# Terminal 1
cd micro-shopping-cart && npm start    # Port 3001

# Terminal 2  
cd micro-user-profile && npm start     # Port 3002

# Terminal 3
cd micro-container && npm start        # Port 3000 (now works!)
```

### Polyrepo Structure in Monorepo (Single Command Works)

#### Root Package.json
```json
{
  "name": "micro-frontend-workspace",
  "workspaces": ["micro-container", "micro-shopping-cart", "micro-user-profile"],
  "scripts": {
    "start": "concurrently \"npm start --prefix micro-container\" \"npm start --prefix micro-shopping-cart\" \"npm start --prefix micro-user-profile\"",
    "start:container": "npm start --prefix micro-container",
    "start:cart": "npm start --prefix micro-shopping-cart"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

#### Single Command Starts All
```bash
# From root directory
npm start                    # Starts all apps simultaneously

# Output:
# [container] Server running on http://localhost:3000
# [cart] Server running on http://localhost:3001  
# [profile] Server running on http://localhost:3002
```

## 🔍 Why the Difference?

### True Polyrepo Characteristics
```
✅ Complete team independence
✅ Separate CI/CD pipelines
✅ Different technology stacks
❌ More complex local development
❌ Need to clone multiple repos
```

### Monorepo with Polyrepo Structure
```
✅ Easy local development (one command)
✅ Shared tooling and scripts
✅ Single repository to clone
❌ Less team independence
❌ Shared CI/CD complexity
```

## 🚀 Practical Solutions

### Option 1: Development Scripts (True Polyrepo)
```bash
# create-dev-setup.sh
#!/bin/bash

# Clone all repositories
git clone https://github.com/company/micro-container.git
git clone https://github.com/company/micro-shopping-cart.git
git clone https://github.com/company/micro-user-profile.git

# Install dependencies
cd micro-container && npm install && cd ..
cd micro-shopping-cart && npm install && cd ..
cd micro-user-profile && npm install && cd ..

# Start all apps
concurrently \
  "cd micro-container && npm start" \
  "cd micro-shopping-cart && npm start" \
  "cd micro-user-profile && npm start"
```

### Option 2: Docker Compose (True Polyrepo)
```yaml
# docker-compose.yml
version: '3.8'
services:
  container:
    build: ./micro-container
    ports:
      - "3000:3000"
    depends_on:
      - shopping-cart
      - user-profile

  shopping-cart:
    build: ./micro-shopping-cart
    ports:
      - "3001:3001"

  user-profile:
    build: ./micro-user-profile
    ports:
      - "3002:3002"
```

```bash
# Single command starts all
docker-compose up
```

### Option 3: Workspace Setup (Hybrid Approach)
```bash
# setup-workspace.sh
#!/bin/bash

mkdir micro-frontend-workspace
cd micro-frontend-workspace

# Clone all repos as subdirectories
git clone https://github.com/company/micro-container.git
git clone https://github.com/company/micro-shopping-cart.git
git clone https://github.com/company/micro-user-profile.git

# Create root package.json
cat > package.json << 'EOF'
{
  "scripts": {
    "start": "concurrently \"npm start --prefix micro-container\" \"npm start --prefix micro-shopping-cart\" \"npm start --prefix micro-user-profile\""
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
EOF

npm install
npm start                    # Now works with single command!
```

## 🎯 Which Approach to Choose?

### Choose True Polyrepo When:
- Teams are completely independent
- Different deployment schedules
- Different technology stacks
- Large organization (10+ developers per team)

### Choose Monorepo Structure When:
- Small teams (2-5 developers total)
- Coordinated releases
- Shared technology stack
- Simplified development workflow

## 🔧 Making True Polyrepo Easier

### VS Code Workspace
```json
// micro-frontend.code-workspace
{
  "folders": [
    { "path": "./micro-container" },
    { "path": "./micro-shopping-cart" },
    { "path": "./micro-user-profile" }
  ],
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Start All Apps",
        "type": "shell",
        "command": "concurrently",
        "args": [
          "\"npm start --prefix micro-container\"",
          "\"npm start --prefix micro-shopping-cart\"", 
          "\"npm start --prefix micro-user-profile\""
        ]
      }
    ]
  }
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "clone-all": "git clone https://github.com/company/micro-container.git && git clone https://github.com/company/micro-shopping-cart.git",
    "install-all": "cd micro-container && npm install && cd ../micro-shopping-cart && npm install",
    "start-all": "concurrently \"cd micro-container && npm start\" \"cd micro-shopping-cart && npm start\""
  }
}
```

## 🎯 Summary

**Your observation is correct!** You CAN run all apps with one command, but:

1. **True Polyrepo**: Requires setup scripts/tools (more realistic for large teams)
2. **Monorepo Structure**: Works out of the box (better for small teams)

The choice depends on your team size, independence requirements, and development workflow preferences.




#### 3. Host Configuration (Development)
```javascript
// webpack.config.js in host
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        shoppingCart: 'shoppingCart@http://localhost:3001/remoteEntry.js',
        userProfile: 'userProfile@http://localhost:3002/remoteEntry.js',
        productCatalog: 'productCatalog@http://localhost:3003/remoteEntry.js'
      }
    })
  ]
};
```

### Complete Local Setup Script
```bash
# start-all-apps.sh
#!/bin/bash

# Start all micro-apps in background
cd micro-shopping-cart && npm start &
cd ../micro-user-profile && npm start &  
cd ../micro-product-catalog && npm start &

# Start host (foreground)
cd ../micro-container && npm start
```

## 🌐 Production Deployment

### Each App Deploys to Different URLs

#### 1. Shopping Cart Deployment (Team A)
```bash
# Team A works on shopping cart
cd micro-shopping-cart
git add .
git commit -m "Add new cart feature"
git push origin main

# GitHub Actions automatically deploys to:
# https://cart.company.com
```

#### 2. Host Configuration (Production)
```javascript
// webpack.config.js in host (production)
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: isProduction ? {
        // Production URLs
        shoppingCart: 'shoppingCart@https://cart.company.com/remoteEntry.js',
        userProfile: 'userProfile@https://profile.company.com/remoteEntry.js',
        productCatalog: 'productCatalog@https://catalog.company.com/remoteEntry.js'
      } : {
        // Development URLs
        shoppingCart: 'shoppingCart@http://localhost:3001/remoteEntry.js',
        userProfile: 'userProfile@http://localhost:3002/remoteEntry.js',
        productCatalog: 'productCatalog@http://localhost:3003/remoteEntry.js'
      }
    })
  ]
};
```

## 📦 Team A Workflow Example

### Repository 2 (Team A - Shopping Cart)

#### 1. Development
```bash
# Team A developer
git clone https://github.com/company/micro-shopping-cart.git
cd micro-shopping-cart
npm install
npm start                    # Runs on localhost:3001

# Make changes
vim src/components/ShoppingCart.tsx
```

#### 2. Testing with Host
```bash
# In another terminal, run host
cd ../micro-container
npm start                    # Host loads cart from localhost:3001
```

#### 3. Deploy Changes
```bash
# Commit and push
git add .
git commit -m "Fix cart total calculation"
git push origin main

# GitHub Actions triggers automatically
```

#### 4. Deployment Pipeline (Shopping Cart)
```yaml
# .github/workflows/deploy-cart.yml
name: Deploy Shopping Cart
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
      
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://cart-app-bucket
        
      - name: Update CloudFront
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CART_CLOUDFRONT_ID }}
```

#### 5. How Changes Reflect in Host

**Automatic Reflection (Runtime Loading)**:
```javascript
// Host loads latest version automatically
const ShoppingCart = React.lazy(() => 
  import('shoppingCart/ShoppingCart')  // Loads from https://cart.company.com
);

// When Team A deploys, host gets new version immediately
// No host redeployment needed!
```

## 🔄 Complete Flow Example

### Scenario: Team A adds new cart feature

#### Step 1: Development
```bash
# Team A developer
cd micro-shopping-cart
npm start                    # localhost:3001

# Add new feature
echo "export const CartWidget = () => <div>New Widget</div>" >> src/components/CartWidget.tsx
```

#### Step 2: Local Testing
```bash
# Host developer tests integration
cd micro-container  
npm start                    # localhost:3000 loads cart from localhost:3001
# ✅ Sees new CartWidget feature
```

#### Step 3: Deploy Cart
```bash
# Team A deploys
cd micro-shopping-cart
git add .
git commit -m "Add cart widget"
git push origin main
# 🚀 Deploys to https://cart.company.com
```

#### Step 4: Production Update
```bash
# Host in production automatically loads new version
# Host webpack config:
remotes: {
  shoppingCart: 'shoppingCart@https://cart.company.com/remoteEntry.js'
}
# ✅ Users see new CartWidget immediately
```

## 🎛️ Environment Configuration

### Development Environment
```javascript
// .env.development in host
REACT_APP_SHOPPING_CART_URL=http://localhost:3001
REACT_APP_USER_PROFILE_URL=http://localhost:3002
REACT_APP_PRODUCT_CATALOG_URL=http://localhost:3003
```

### Production Environment  
```javascript
// .env.production in host
REACT_APP_SHOPPING_CART_URL=https://cart.company.com
REACT_APP_USER_PROFILE_URL=https://profile.company.com
REACT_APP_PRODUCT_CATALOG_URL=https://catalog.company.com
```

### Dynamic Configuration
```javascript
// webpack.config.js in host
const getRemoteUrl = (name, port) => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev 
    ? `http://localhost:${port}/remoteEntry.js`
    : `https://${name}.company.com/remoteEntry.js`;
};

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        shoppingCart: `shoppingCart@${getRemoteUrl('cart', 3001)}`,
        userProfile: `userProfile@${getRemoteUrl('profile', 3002)}`,
        productCatalog: `productCatalog@${getRemoteUrl('catalog', 3003)}`
      }
    })
  ]
};
```

## 🚨 Common Issues & Solutions

### Issue 1: Host runs but micro-apps don't load
```bash
# Problem: Micro-apps not running
# Solution: Start each micro-app
cd micro-shopping-cart && npm start &
cd micro-user-profile && npm start &
cd micro-product-catalog && npm start &
```

### Issue 2: CORS errors in development
```javascript
// Add to webpack.config.js in micro-apps
module.exports = {
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  }
};
```

### Issue 3: Production deployment doesn't reflect
```bash
# Check if micro-app deployed correctly
curl https://cart.company.com/remoteEntry.js

# Clear CDN cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## 📋 Quick Commands

### Start All Apps (Development)
```bash
# Method 1: Manual
npm start --prefix micro-container &
npm start --prefix micro-shopping-cart &
npm start --prefix micro-user-profile &
npm start --prefix micro-product-catalog &

# Method 2: Using concurrently
npm install -g concurrently
concurrently \
  "npm start --prefix micro-container" \
  "npm start --prefix micro-shopping-cart" \
  "npm start --prefix micro-user-profile" \
  "npm start --prefix micro-product-catalog"
```

### Deploy Single App
```bash
# Deploy only shopping cart
cd micro-shopping-cart
git push origin main        # Triggers deployment

# Host automatically gets updates (no redeployment needed)
```

### Check Deployment Status
```bash
# Check if micro-app is live
curl -I https://cart.company.com/remoteEntry.js
curl -I https://profile.company.com/remoteEntry.js
curl -I https://catalog.company.com/remoteEntry.js
```

## 🎯 Key Takeaways

1. **Independent Running**: Each app runs on different ports/URLs
2. **Independent Deployment**: Teams deploy without coordinating
3. **Runtime Loading**: Host loads micro-apps from their URLs
4. **Automatic Updates**: Host gets new versions without redeployment
5. **No Coordination**: Teams work completely independently

**Remember**: Host doesn't contain micro-app code, it just loads them from URLs!