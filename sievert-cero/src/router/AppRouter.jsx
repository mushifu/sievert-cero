import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import CreateCharacter from '../pages/CreateCharacter'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crear"
          element={
            <ProtectedRoute>
              <CreateCharacter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}