# Micro-Frontend Data Sharing Examples

## 1. Props (What you're currently using)
**Container passes id to app1:**
```tsx
// Container
<CounterAppOne id={1233} />

// App1 receives it
interface CounterProps {
  id?: number;
}
const Counter: React.FC<CounterProps> = ({ id }) => {
  return <div>Container ID: {id}</div>;
};
```

## 2. Custom Events
```tsx
// App1 sends data to container
const sendData = () => {
  window.dispatchEvent(new CustomEvent('app1-data', { 
    detail: { count, userId: 'user123' } 
  }));
};

// Container listens
useEffect(() => {
  const handler = (e: CustomEvent) => console.log(e.detail);
  window.addEventListener('app1-data', handler);
  return () => window.removeEventListener('app1-data', handler);
}, []);
```

## 3. Shared Context
```tsx
// Shared context provider in container
const AppContext = createContext({ user: null, setUser: () => {} });

<AppContext.Provider value={{user, setUser}}>
  <CounterAppOne />
  <CounterAppTwo />
</AppContext.Provider>

// Apps consume context
const { user } = useContext(AppContext);
```

## 4. LocalStorage
```tsx
// App1 saves data
localStorage.setItem('shared-data', JSON.stringify({id: 1233}));

// App2 reads data
const sharedData = JSON.parse(localStorage.getItem('shared-data') || '{}');
```