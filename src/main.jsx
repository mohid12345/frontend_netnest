import './index.css'
import React from 'react'
import App from './App'
import ReactDOM from 'react-dom'
import {store, persistor} from './utils/context/store'
import appRouter from './routes/UserRoutes'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster richColors position='top-right'/>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={appRouter}>
        <App/>
      </RouterProvider>
    </PersistGate>
  </Provider>
)
