import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'

export default function CharacterMaster() {

  const { id } = useParams()

  const navigate = useNavigate()

  const user =
    useAuthStore((state) => state.user)

  const [character, setCharacter] = useState(null)
  const [traits, setTraits] = useState({
    fisico: [],
    mental: [],
    interaccion: []
  })

  useEffect(() => {

    // bloquear acceso
    if (user.username !== 'master') {
      navigate('/')
      return
    }

    loadCharacter()

  }, [])

  const loadCharacter = async () => {

    const { data, error } = await supabase
      .from('Sievert_PJ')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setCharacter(data)
    setTraits(
      data.Rasgos?.rasgos || {
        fisico: [],
        mental: [],
        interaccion: []
      }
    )
  }
const addTrait = (category) => {

  setTraits((prev) => ({
    ...prev,

    [category]: [
      ...prev[category],

      {
        nombre: '',
        descripcion: ''
      }
    ]
  }))
}
const removeTrait = (
  category,
  index
) => {

  setTraits((prev) => ({

    ...prev,

    [category]:
      prev[category].filter(
        (_, i) => i !== index
      )
  }))
}
const updateTrait = (
  category,
  index,
  field,
  value
) => {

  setTraits((prev) => {

    const updated = [...prev[category]]

    updated[index][field] = value

    return {
      ...prev,
      [category]: updated
    }
  })
}
const saveTraits = async () => {

  const { error } = await supabase
    .from('Sievert_PJ')
    .update({
      Rasgos: {
        ...character.Rasgos,

        rasgos: traits
      }
    })
    .eq('id', character.id)

  if (error) {
    console.error(error)

    alert('Error guardando rasgos')

    return
  }

  alert('Rasgos guardados')
}
  if (!character) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#090c12',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Cargando personaje...
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #1b2433 0%, #090c12 70%)',

        color: 'white',

        padding: '40px',

        fontFamily: 'Arial, sans-serif'
      }}
    >

      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '30px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        ← Volver
      </button>

      <div
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >

        {/* izquierda */}
        <div
          style={{
            flex: 1,
            minWidth: '320px'
          }}
        >

          <img
            src={character.Imagen}
            alt={character.Nombre}
            style={{
              width: '100%',
              maxWidth: '420px',
              borderRadius: '24px',
              marginBottom: '30px'
            }}
          />

          <h1
            style={{
              marginTop: 0,
              marginBottom: '10px'
            }}
          >
            {character.Nombre} {character.Apellidos}
          </h1>

          <div
            style={{
              opacity: 0.7,
              marginBottom: '30px'
            }}
          >
            {character.Genero}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '20px'
            }}
          >
            <div>
              💪 {character['Físico']}
            </div>

            <div>
              🧠 {character['Cognición']}
            </div>

            <div>
              🗣 {character['Interacción']}
            </div>
          </div>

        </div>

        {/* derecha */}
        <div
          style={{
            flex: 1,
            minWidth: '320px'
          }}
        >

          <h2
            style={{
              marginTop: 0,
              marginBottom: '30px'
            }}
          >
            Editor de rasgos
          </h2>

          {[
            {
              key: 'fisico',
              label: '💪 Físico'
            },

            {
              key: 'mental',
              label: '🧠 Cognición'
            },

            {
              key: 'interaccion',
              label: '🗣 Interacción'
            }
          ].map((section) => (

            <div
              key={section.key}
              style={{
                marginBottom: '40px'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}
              >

                <h3
                  style={{
                    margin: 0
                  }}
                >
                  {section.label}
                </h3>

                <button
                  onClick={() =>
                    addTrait(section.key)
                  }

                  style={{
                    background: '#184a96',
                    border: 'none',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  + Añadir
                </button>

              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >

                {traits[section.key].map(
                  (trait, index) => (

                  <div
                    key={index}

                    style={{
                      background:
                        'rgba(255,255,255,0.04)',

                      border:
                        '1px solid rgba(255,255,255,0.08)',

                      borderRadius: '16px',

                      padding: '20px'
                    }}
                  >

                    <input
                      value={trait.nombre}

                      onChange={(e) =>
                        updateTrait(
                          section.key,
                          index,
                          'nombre',
                          e.target.value
                        )
                      }

                      placeholder="Nombre del rasgo"

                      style={{
                        width: '100%',
                        marginBottom: '14px',

                        background: 'transparent',

                        border: 'none',

                        borderBottom:
                          '1px solid rgba(255,255,255,0.2)',

                        color: 'white',

                        padding: '10px 0',

                        fontSize: '18px',

                        outline: 'none'
                      }}
                    />

                    <textarea
                      value={trait.descripcion}

                      onChange={(e) =>
                        updateTrait(
                          section.key,
                          index,
                          'descripcion',
                          e.target.value
                        )
                      }

                      placeholder="Descripción"

                      style={{
                        width: '100%',
                        minHeight: '80px',

                        background: 'transparent',

                        border: 'none',

                        borderBottom:
                          '1px solid rgba(255,255,255,0.2)',

                        color: 'white',

                        resize: 'vertical',

                        outline: 'none'
                      }}
                    />

                    <button
                      onClick={() =>
                        removeTrait(
                          section.key,
                          index
                        )
                      }

                      style={{
                        marginTop: '16px',

                        background: 'transparent',

                        border: 'none',

                        color: '#ff7b7b',

                        cursor: 'pointer'
                      }}
                    >
                      Eliminar rasgo
                    </button>

                  </div>

                ))}

              </div>

            </div>

          ))}

          <button
            onClick={saveTraits}

            style={{
              background: '#184a96',
              border: 'none',
              color: 'white',
              padding: '16px 22px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Guardar cambios
          </button>

        </div>

      </div>

    </div>
  )
}