import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'


export default function Dashboard() {

  const user =
    useAuthStore((state) => state.user)
    const logout =
      useAuthStore((state) => state.logout)

  const [personajes, setPersonajes] =
    useState([])
const isMobile = window.innerWidth < 768
  const navigate = useNavigate()

  useEffect(() => {
    loadPersonajes()
  }, [])

  const loadPersonajes = async () => {

    const { data, error } = await supabase
      .from('Sievert_PJ')
      .select('*')
      .eq('user_id', user.id)

    if (data) {
      setPersonajes(data)
    } else {
      console.error(error)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #1b2433 0%, #090c12 70%)',
        color: 'white',
        padding: '50px 30px',
        position: 'relative',
        fontFamily: 'Arial, sans-serif'
      }}
    >

      {/* titulo */}
      <button
        onClick={() => {

          logout()

          navigate('/login')
        }}

        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',

          background: 'rgba(255,255,255,0.06)',

          border: '1px solid rgba(255,255,255,0.12)',

          color: 'white',

          padding: '10px 16px',

          borderRadius: '12px',

          cursor: 'pointer',

          backdropFilter: 'blur(10px)',

          fontSize: '14px',

          opacity: 0.8
        }}
      >
        Cerrar sesión
      </button>
      <div
        style={{
          marginBottom: '50px'
        }}
      >
        <div
          style={{
            fontSize: '18px',
            opacity: 0.75,
            marginBottom: '10px'
          }}
        >
          Hola, {
            user.username.charAt(0).toUpperCase() +
            user.username.slice(1)
          }
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: '42px'
          }}
        >
          Tus personajes
        </h1>
        <div
          style={{
            opacity: 0.45,
            fontSize: '14px',
            marginTop: '6px'
          }}
        >
          {personajes.length} personajes
        </div>
      </div>

      {/* grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(240px, 1fr))',

          gap: '28px'
        }}
      >

        {/* personajes */}
        {personajes.map((p) => (

          <div
            key={p.id}
            style={{
              position: 'relative'
            }}
          >

            {/* borrar */}
            <button
              type="button"

              onClick={async (e) => {

                e.stopPropagation()

                const confirmed = window.confirm(
                  `¿Eliminar a ${p.Nombre}?`
                )

                if (!confirmed) return

                const { error } = await supabase
                  .from('Sievert_PJ')
                  .delete()
                  .eq('id', p.id)

                if (error) {
                  console.error(error)

                  alert('Error eliminando personaje')

                  return
                }

                setPersonajes((prev) =>
                  prev.filter((char) => char.id !== p.id)
                )
              }}

              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',

                width: isMobile ? '44px' : '38px',
                height: isMobile ? '44px' : '38px',

                borderRadius: '50%',
                border: 'none',

                background: 'rgba(0,0,0,0.45)',

                backdropFilter: 'blur(10px)',

                color: 'white',

                cursor: 'pointer',

                zIndex: 20,

                fontSize: isMobile ? '18px' : '16px',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                opacity: 0.8
              }}
            >
              🗑
            </button>

            {/* CARD */}
            <button
              type="button"
              style={{
                width: '100%',
                border: 'none',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: '0.25s',
                padding: 0,
                color: 'white',
                textAlign: 'left',
                boxShadow:
                  '0 10px 30px rgba(0,0,0,0.35)'
              }}
            >

              {/* imagen */}
              <div
                style={{
                  height: '320px',
                  background:
                    p.Imagen
                      ? `url(${p.Imagen}) center/cover`
                      : '#222',

                  position: 'relative'
                }}
              >

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85), transparent 45%)'
                  }}
                />

              </div>

              {/* info */}
              <div
                style={{
                  padding: '20px'
                }}
              >

                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    lineHeight: 1.1
                  }}
                >
                  {p.Nombre} {p.Apellidos}
                </div>

                <div
                  style={{
                    opacity: 0.7,
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}
                >
                  {p.Genero || 'Sin género'}
                  {' • '}
                  {p.Ocupación || 'Sin ocupación'}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '14px',
                    fontSize: '14px',
                    opacity: 0.75
                  }}
                >
                  <div>
                    💪 {p['Físico']}
                  </div>

                  <div>
                    🧠 {p['Cognición']}
                  </div>

                  <div>
                    🗣 {p['Interacción']}
                  </div>
                </div>

              </div>

            </button>

          </div>

        ))}

        {/* crear personaje */}
        <button
          onClick={() => navigate('/crear')}
          style={{
            border:
              '2px dashed rgba(255,255,255,0.2)',

            background:
              'rgba(255,255,255,0.03)',

            borderRadius: '24px',
            minHeight: '420px',
            color: 'white',
            cursor: 'pointer',
            transition: '0.25s',
            fontSize: '22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}

          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'rgba(255,255,255,0.06)'

            e.currentTarget.style.transform =
              'translateY(-6px)'
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'rgba(255,255,255,0.03)'

            e.currentTarget.style.transform =
              'translateY(0)'
          }}
        >

          <div
            style={{
              fontSize: '72px',
              lineHeight: 1,
              opacity: 0.7
            }}
          >
            +
          </div>

          <div>
            Nuevo personaje
          </div>

        </button>

      </div>

    </div>
  )
}