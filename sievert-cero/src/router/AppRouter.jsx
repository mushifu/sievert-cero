import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import CreateCharacter from '../pages/CreateCharacter'
import ProtectedRoute from '../components/ProtectedRoute'
import CharacterDetail from '../pages/CharacterDetail'
import CharacterMaster from '../pages/CharacterMaster'

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
        <Route
          path="/personaje/:id"
          element={<CharacterDetail />}
        />
        <Route
          path="/master/personaje/:id"
          element={<CharacterMaster />}
        />
      </Routes>
    </BrowserRouter>
  )
}