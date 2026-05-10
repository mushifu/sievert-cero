import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('Usuario')
      .select('*')
      .eq('username', nombre)
      .eq('password', password)
      .single()

    if (data) {
      login(data)
      navigate('/')
    } else {
      alert('Credenciales incorrectas')
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  )
}