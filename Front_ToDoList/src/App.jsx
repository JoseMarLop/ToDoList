import React, { Suspense } from 'react'
import { CSpinner } from '@coreui/react'
import { BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import RouteGuard from "./RouteGuard"
import './App.css'


const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Welcome = React.lazy(() => import('./pages/Welcome'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

const App = () => {

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route 
              path="/" 
              element={
                <RouteGuard isPublic>
                  <Welcome/>
                </RouteGuard>
              }
            />
          <Route 
              path="/welcome" 
              element={
                <RouteGuard isPublic>
                  <Welcome/>
                </RouteGuard>
              }
            />
          <Route 
              path="/login" 
              element={
                <RouteGuard isPublic>
                  <Login/>
                </RouteGuard>
              }
            />
            <Route 
              path="/register" 
              element={
                <RouteGuard isPublic>
                  <Register/>
                </RouteGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RouteGuard>
                  <Dashboard/>
                </RouteGuard>
              }
            />
            <Route
            path="*"
            element={
              <RouteGuard isPublic>
                <Navigate to="/welcome" replace />
              </RouteGuard>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
