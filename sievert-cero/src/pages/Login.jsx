import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Login() {

  const [nombre, setNombre] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [errorText, setErrorText] =
    useState('')

  const login =
    useAuthStore((state) => state.login)

  const navigate = useNavigate()

  const handleLogin = async () => {

    setErrorText('')

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

      setErrorText(
        'Credenciales incorrectas'
      )
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',

        background:
          'radial-gradient(circle at top, #1b2433 0%, #090c12 70%)',

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        padding: '30px',

        color: 'white',

        fontFamily: 'Arial, sans-serif'
      }}
    >

      {/* panel */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',

          background:
            'rgba(255,255,255,0.04)',

          border:
            '1px solid rgba(255,255,255,0.08)',

          borderRadius: '28px',

          padding: '40px',

          backdropFilter: 'blur(20px)',

          boxShadow:
            '0 20px 60px rgba(0,0,0,0.45)'
        }}
      >

        {/* logo */}
        <div
          style={{
            marginBottom: '40px'
          }}
        >

          <div
            style={{
              fontSize: '14px',
              letterSpacing: '4px',
              opacity: 0.5,
              marginBottom: '12px'
            }}
          >
            SISTEMA SIEVERT
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '38px',
              lineHeight: 1.1
            }}
          >
            Acceso autorizado
          </h1>

        </div>

        {/* usuario */}
        <div
          style={{
            marginBottom: '24px'
          }}
        >

          <div
            style={{
              marginBottom: '10px',
              opacity: 0.7,
              fontSize: '14px'
            }}
          >
            Usuario
          </div>

          <input
            value={nombre}

            onChange={(e) =>
              setNombre(e.target.value)
            }

            placeholder="Introduzca su usuario"

            style={{
              width: '100%',

              background:
                'rgba(255,255,255,0.05)',

              border:
                '1px solid rgba(255,255,255,0.08)',

              borderRadius: '14px',

              padding: '16px',

              color: 'white',

              outline: 'none',

              fontSize: '16px'
            }}
          />

        </div>

        {/* password */}
        <div
          style={{
            marginBottom: '30px'
          }}
        >

          <div
            style={{
              marginBottom: '10px',
              opacity: 0.7,
              fontSize: '14px'
            }}
          >
            Contraseña
          </div>

          <input
            type="password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }

            placeholder="Introduzca su contraseña"

            style={{
              width: '100%',

              background:
                'rgba(255,255,255,0.05)',

              border:
                '1px solid rgba(255,255,255,0.08)',

              borderRadius: '14px',

              padding: '16px',

              color: 'white',

              outline: 'none',

              fontSize: '16px'
            }}
          />

        </div>

        {/* error */}
        {errorText && (

          <div
            style={{
              marginBottom: '24px',
              color: '#ff7b7b',
              fontSize: '14px'
            }}
          >
            {errorText}
          </div>

        )}

        {/* botón */}
        <button
          onClick={handleLogin}

          style={{
            width: '100%',

            background:
              'linear-gradient(to right, #184a96, #2563c9)',

            border: 'none',

            borderRadius: '16px',

            padding: '16px',

            color: 'white',

            fontSize: '16px',

            fontWeight: 'bold',

            cursor: 'pointer',

            transition: '0.2s'
          }}

          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              'translateY(-2px)'
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              'translateY(0)'
          }}
        >
          Entrar al sistema
        </button>

      </div>

    </div>
  )
}