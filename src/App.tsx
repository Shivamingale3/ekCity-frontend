// src/App.tsx
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { ThemeProvider } from './hooks/useTheme';
import { Toaster } from './components/ui/sonner';

function App() {

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </ThemeProvider>
  )
}

export default App;