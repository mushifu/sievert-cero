import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

import styles from './Login.module.css'

export default function Login() {

  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    const { data } = await supabase
      .from('Usuario')
      .select('*')
      .eq('username', nombre)
      .eq('password', password)
      .single()
    if (data) {
      login(data)
      navigate('/')
    } else {
      setError(
        'Credenciales incorrectas'
      )
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sievert</h1>
        <div className={styles.subtitle}>Acceso al sistema de evaluación psicológica.</div>
        <div className={styles.field}>
          <label className={styles.label}>Usuario</label>
          <input
            className={styles.input}
            placeholder="Introduzca su usuario"
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Contraseña</label>
          <input
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <button className={styles.button} onClick={handleLogin}>Entrar al sistema</button>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}