import { useState, useEffect } from 'react'
import { steps } from '../config/steps'
import { useCharacterStore } from '../store/characterStore'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function CreateCharacter() {
  const {
    stepIndex,
    nextStep,
    prevStep,
    setField,
    data,
    reset
  } = useCharacterStore()

  const [phase, setPhase] = useState('video')
  const [finalizing, setFinalizing] = useState(false)

  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const step = steps[stepIndex]

  const isMobile = window.innerWidth < 768

  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [stats, setStats] = useState({
    fisico: 1,
    mental: 1,
    interaccion: 1
  })
  const [statReasons, setStatReasons] = useState({
    fisico: '',
    mental: '',
    interaccion: ''
  })

  const totalPoints = 9

  const usedPoints =
    stats.fisico +
    stats.mental +
    stats.interaccion

  const remainingPoints =
    totalPoints - usedPoints

  const [contacts, setContacts] = useState([
    {
      name: '',
      relation: '',
      message: ''
    },
    {
      name: '',
      relation: '',
      message: ''
    },
    {
      name: '',
      relation: '',
      message: ''
    }
  ])
  const [emergencyContact, setEmergencyContact] = useState('')

  const increaseStat = (stat) => {
    if (remainingPoints <= 0) return

    setStats((prev) => ({
      ...prev,
      [stat]: prev[stat] + 1
    }))
  }

  const decreaseStat = (stat) => {
    if (stats[stat] <= 1) return

    setStats((prev) => ({
      ...prev,
      [stat]: prev[stat] - 1
    }))
  }

  useEffect(() => {
    const next = steps[stepIndex + 1]

    if (next?.video) {
      const video = document.createElement('video')
      video.src = next.video
      video.preload = 'auto'
    }
  }, [stepIndex])

  if (!step) return <div>Finalizado</div>

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const newData = { ...data }

    if (step.type === 'stats') {
      newData.stats = stats
        newData.statReasons = statReasons
    } else if (step.type === 'contacts') {
             newData.contacts = contacts
    } else if (step.type === 'emergencyContact') {
        newData.emergencyContact = emergencyContact
    } else if (step.type === 'summary') {
        //nada
    } else {
      step.fields.forEach((field) => {
        newData[field.name] = formData.get(field.name)
      })
    }

    Object.entries(newData).forEach(([key, value]) => {
      setField(key, value)
    })

    if (stepIndex === steps.length - 1) {

      try {

        let imageUrl = null

        // subir imagen si existe
        if (imageFile) {

          const fileExt =
            imageFile.name.split('.').pop()

          const fileName =
            `${Date.now()}-${crypto.randomUUID()}.${fileExt}`

          const filePath =
            `characters/${fileName}`

          const { data, error: uploadError } =
            await supabase.storage
              .from('character-images')
              .upload(filePath, imageFile, {
                upsert: true,
                contentType: imageFile.type
              })

          if (uploadError) {
            console.error("Error subiendo imagen", uploadError)

            alert('Error subiendo imagen')

            return
          }

          // obtener URL pública
          const { data: publicData } =
            supabase.storage
              .from('character-images')
              .getPublicUrl(filePath)

          imageUrl = publicData.publicUrl
        }
        setFinalizing(true)
        // guardar personaje
        const { error } = await supabase
          .from('Sievert_PJ')
          .insert({
            user_id: user.id,

            Nombre: newData.nombre,
            Apellidos: newData.apellidos,
            Genero: newData.genero,
            Ocupación: newData.ocupacion,

            Físico: newData.stats?.fisico,
            Cognición: newData.stats?.mental,
            Interacción: newData.stats?.interaccion,

            Rec_bueno: newData.buenRecuerdo,
            Rec_malo: newData.malRecuerdo,

            Imagen: imageUrl,
            Thumbnail: imageUrl,

            Contactos: {
              contactos: contacts,
              contactoEmergencia: emergencyContact
            },

            Rasgos: {
              razonesStats: statReasons
            }
          })

        if (error) {
          console.error(error)

          alert('Error al guardar personaje')

          return
        }

        reset()
        setTimeout(() => {
          navigate('/')
        }, 3000)

      } catch (err) {

        console.error(err)

        alert('Ha ocurrido un error inesperado')

      }

      return
    }

    nextStep()
    setPhase('video')
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'black'
      }}
    >
      {/* VIDEO */}
      {phase === 'video' && (
        <>
          <video
            key={step.id}
            src={step.video}
            autoPlay

            playsInline
            onEnded={() => setPhase('form')}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: isMobile
                ? step.mobilePosition
                : 'center center'
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)'
            }}
          />

          <button
            onClick={() => setPhase('form')}
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.5)',
              padding: '8px 14px',
              cursor: 'pointer'
            }}
          >
            Saltar
          </button>
        </>
      )}

      {/* FORM */}
      {phase === 'form' && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.35)'
            }}
          />
          <button
            type="button"
            onClick={() => setPhase('video')}
            style={{
              position: 'absolute',
              top: '25px',
              right: '25px',
              width: isMobile ? '52px' : '60px',
              height: isMobile ? '52px' : '60px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontSize: isMobile ? '20px' : '24px',
              cursor: 'pointer',
              zIndex: 50,
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              transition: '0.2s'
            }}
          >
            ⟳
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              animation: 'slideUp 0.5s ease-out'
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                maxWidth: '950px',
                background: '#f8f8f6',
                borderTopLeftRadius: '28px',
                borderTopRightRadius: '28px',
                padding: isMobile ? '25px' : '40px',
                paddingBottom: '60px',
                color: '#163c7a',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.45)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* tirador */}
              <div
                style={{
                  width: '80px',
                  height: '6px',
                  background: '#d0d0d0',
                  borderRadius: '999px',
                  margin: '0 auto 30px auto'
                }}
              />

              {/* cabecera */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}
              >
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: isMobile ? '22px' : '28px',
                      color: '#184a96'
                    }}
                  >
                    Dra. Claudia Martín
                  </h1>

                  <div
                    style={{
                      fontSize: isMobile ? '15px' : '18px',
                      marginTop: '5px'
                    }}
                  >
                    Psicóloga
                  </div>
                </div>

                <div
                  style={{
                    fontSize: isMobile ? '48px' : '74px',
                    lineHeight: 1,
                    opacity: 0.7
                  }}
                >
                  ⚕
                </div>
              </div>

              {/* linea */}
              <div
                style={{
                  height: '4px',
                  background: '#184a96',
                  marginBottom: '20px'
                }}
              />

              {/* titulo */}
              <div
                style={{
                  marginBottom: '40px'
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '16px' : '20px'
                  }}
                >
                  SEGUIMIENTO DEL PACIENTE
                </h2>
              </div>

              {/* STATS */}
              {step.type === 'stats' ? (
                <div
                  style={{
                    maxWidth: '700px',
                    margin: '0 auto'
                  }}
                >
                  <div
                    style={{
                      marginBottom: '20px',
                      fontSize: '12px',
                      opacity: 0.75
                    }}
                  >
                    Distribuya 9 puntos entre las siguientes capacidades.
                  </div>

                  <div
                    style={{
                      marginBottom: '30px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color:
                        remainingPoints === 0
                          ? '#2d7a36'
                          : '#184a96'
                    }}
                  >
                    Puntos restantes: {remainingPoints}
                  </div>

                  {[
                    {
                      key: 'fisico',
                      icon: '💪',
                      label: 'Físico',
                      description:
                        'Fuerza, resistencia y capacidad corporal.'
                    },
                    {
                      key: 'mental',
                      icon: '🧠',
                      label: 'Cognición',
                      description:
                        'Concentración, percepción y estabilidad.'
                    },
                    {
                      key: 'interaccion',
                      icon: '🗣️',
                      label: 'Interacción',
                      description:
                        'Carisma, empatía y habilidades sociales.'
                    }
                  ].map((stat) => (
                    <div
                      key={stat.key}
                      style={{
                        marginBottom: '15px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid #d5deec'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: isMobile
                            ? 'flex-start'
                            : 'center',
                          flexDirection: isMobile
                            ? 'column'
                            : 'row',
                          gap: '20px'
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              fontSize: '18px',
                              marginBottom: '8px'
                            }}
                          >
                            <span>{stat.icon}</span>

                            <span
                              style={{
                                fontWeight: 'bold'
                              }}
                            >
                              {stat.label}
                            </span>
                          </div>

                          <div
                            style={{
                              opacity: 0.7,
                              lineHeight: 1.4
                            }}
                          >
                            {stat.description}
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              decreaseStat(stat.key)
                            }
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: 'none',
                              background: '#184a96',
                              color: 'white',
                              fontSize: '16px',
                              cursor: 'pointer'
                            }}
                          >
                            −
                          </button>

                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              minWidth: '30px',
                              textAlign: 'center'
                            }}
                          >
                            {stats[stat.key]}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              increaseStat(stat.key)
                            }
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: 'none',
                              background:
                                remainingPoints <= 0
                                  ? '#9aaed1'
                                  : '#184a96',
                              color: 'white',
                              fontSize: '16px',
                              cursor: 'pointer'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              {remainingPoints === 0 && (
                <div
                  style={{
                    marginTop: '50px'
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '30px'
                    }}
                  >
                    Justifique su evaluación
                  </div>

                  {[
                    {
                      key: 'fisico',
                      label: '¿Por qué ha asignado esa puntuación en físico?'
                    },
                    {
                      key: 'mental',
                      label: '¿Por qué ha asignado esa puntuación en cognición?'
                    },
                    {
                      key: 'interaccion',
                      label: '¿Por qué ha asignado esa puntuación en interacción?'
                    }
                  ].map((item) => (
                    <div
                      key={item.key}
                      style={{
                        marginBottom: '30px'
                      }}
                    >
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: 'bold'
                        }}
                      >
                        {item.label}
                      </label>

                      <textarea
                        value={statReasons[item.key]}
                        onChange={(e) =>
                          setStatReasons((prev) => ({
                            ...prev,
                            [item.key]: e.target.value
                          }))
                        }
                        placeholder="Escriba aquí su respuesta..."
                        style={{
                          width: '100%',
                          minHeight: '90px',
                          border: 'none',
                          borderBottom: '2px solid #9aaed1',
                          background: 'transparent',
                          padding: '10px 4px',
                          outline: 'none',
                          color: '#184a96',
                          resize: 'vertical',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
                </div>
              ) : step.type === 'contacts' ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '420px',
                        background: '#111',
                        borderRadius: '36px',
                        padding: '14px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                      }}
                    >

                      {/* notch */}
                      <div
                        style={{
                          width: '120px',
                          height: '26px',
                          background: '#222',
                          borderRadius: '999px',
                          margin: '0 auto 20px auto'
                        }}
                      />

                      {/* app */}
                      <div
                        style={{
                          background: '#efeae2',
                          borderRadius: '24px',
                          overflow: 'hidden'
                        }}
                      >

                        {/* header */}
                        <div
                          style={{
                            background: '#075e54',
                            color: 'white',
                            padding: '16px',
                            fontWeight: 'bold'
                          }}
                        >
                          Conversaciones recientes
                        </div>

                        {/* chats */}
                        {contacts.map((contact, index) => (

                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              gap: '14px',
                              padding: '16px',
                              borderBottom: '1px solid #ddd',
                              alignItems: 'flex-start',
                              background: 'white'
                            }}
                          >

                            {/* avatar */}
                            <div
                              style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: '#cfd8dc',
                                flexShrink: 0
                              }}
                            />

                            {/* content */}
                            <div
                              style={{
                                flex: 1
                              }}
                            >

                              {/* nombre */}
                              <input
                                value={contact.name}
                                onChange={(e) => {
                                  const updated = [...contacts]
                                  updated[index].name = e.target.value
                                  setContacts(updated)
                                }}
                                placeholder="Nombre del contacto"
                                style={{
                                  width: '100%',
                                  border: 'none',
                                  background: 'transparent',
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                  marginBottom: '4px',
                                  outline: 'none'
                                }}
                              />

                              {/* relación */}
                              <input
                                value={contact.relation}
                                onChange={(e) => {
                                  const updated = [...contacts]
                                  updated[index].relation = e.target.value
                                  setContacts(updated)
                                }}
                                placeholder="Relación"
                                style={{
                                  width: '100%',
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#666',
                                  marginBottom: '6px',
                                  outline: 'none',
                                  fontSize: '14px'
                                }}
                              />

                              {/* mensaje */}
                              <textarea
                                value={contact.message}
                                onChange={(e) => {
                                  const updated = [...contacts]
                                  updated[index].message = e.target.value
                                  setContacts(updated)
                                }}
                                placeholder="Último mensaje..."
                                style={{
                                  width: '100%',
                                  border: 'none',
                                  background: 'transparent',
                                  resize: 'none',
                                  outline: 'none',
                                  color: '#444',
                                  fontSize: '14px',
                                  minHeight: '50px'
                                }}
                              />

                            </div>

                          </div>

                        ))}

                      </div>
                    </div>
                  </div>
              ) : step.type === 'emergencyContact' ? (
                  <div
                    style={{
                      maxWidth: '700px',
                      margin: '0 auto'
                    }}
                  >

                    <div
                      style={{
                        marginBottom: '20px',
                        fontSize: '18px',
                        opacity: 0.75,
                        lineHeight: 1.5
                      }}
                    >
                      En caso de encontrarse en una situación de peligro,
                      ansiedad extrema o crisis emocional...
                    </div>

                    <div
                      style={{
                        marginBottom: '40px',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: '#184a96'
                      }}
                    >
                      ¿A cuál de estas personas recurriría primero?
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px'
                      }}
                    >

                      {contacts.map((contact, index) => (

                        <button
                          key={index}
                          type="button"
                          onClick={() => setEmergencyContact(contact.name)}
                          style={{
                            border:
                              emergencyContact === contact.name
                                ? '2px solid #184a96'
                                : '2px solid #d5deec',

                            background:
                              emergencyContact === contact.name
                                ? 'rgba(24,74,150,0.06)'
                                : 'white',

                            borderRadius: '16px',
                            padding: '20px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: '0.2s'
                          }}
                        >

                          <div
                            style={{
                              fontWeight: 'bold',
                              fontSize: '20px',
                              marginBottom: '6px',
                              color: '#184a96'
                            }}
                          >
                            {contact.name}
                          </div>

                          <div
                            style={{
                              opacity: 0.7,
                              marginBottom: '10px',
                              fontSize: '15px'
                            }}
                          >
                            {contact.relation}
                          </div>

                          <div
                            style={{
                              fontStyle: 'italic',
                              opacity: 0.8,
                              fontSize: '14px'
                            }}
                          >
                            “{contact.message}”
                          </div>

                        </button>

                      ))}

                    </div>

                  </div>
              ) : step.type === 'summary' ? (
                  <div
                    style={{
                      maxWidth: '800px',
                      margin: '0 auto'
                    }}
                  >

                    <div
                      style={{
                        marginBottom: '40px'
                      }}
                    >

                      <div
                        style={{
                          fontSize: '26px',
                          fontWeight: 'bold',
                          marginBottom: '10px',
                          color: '#184a96'
                        }}
                      >
                        Evaluación completada
                      </div>

                      <div
                        style={{
                          opacity: 0.75,
                          lineHeight: 1.6,
                          fontSize: '16px'
                        }}
                      >
                        Revise cuidadosamente la información proporcionada antes de finalizar la sesión.
                      </div>

                    </div>

                    {/* datos */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px'
                      }}
                    >

                      {/* identidad */}
                      <div>
                        <h3>Identidad</h3>

                        <div>
                          <strong>Nombre:</strong> {data.nombre}
                        </div>

                        <div>
                          <strong>Edad:</strong> {data.edad}
                        </div>
                      </div>

                      {/* stats */}
                      <div>
                        <h3>Perfil psicológico</h3>

                        <div>
                          <strong>Físico:</strong> {data.stats?.fisico}
                        </div>

                        <div>
                          <strong>Cognición:</strong> {data.stats?.mental}
                        </div>

                        <div>
                          <strong>Interacción:</strong> {data.stats?.interaccion}
                        </div>
                      </div>

                      {/* recuerdos */}
                      <div>
                        <h3>Recuerdos</h3>

                        <div style={{ marginBottom: '15px' }}>
                          <strong>Buen recuerdo:</strong>

                          <div
                            style={{
                              opacity: 0.8,
                              marginTop: '6px'
                            }}
                          >
                            {data.buenRecuerdo}
                          </div>
                        </div>

                        <div>
                          <strong>Mal recuerdo:</strong>

                          <div
                            style={{
                              opacity: 0.8,
                              marginTop: '6px'
                            }}
                          >
                            {data.malRecuerdo}
                          </div>
                        </div>
                      </div>

                      {/* contactos */}
                      <div>
                        <h3>Red de apoyo</h3>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px'
                          }}
                        >

                          {contacts.map((contact, index) => (

                            <div
                              key={index}
                              style={{
                                border: '1px solid #d5deec',
                                borderRadius: '12px',
                                padding: '14px'
                              }}
                            >

                              <div
                                style={{
                                  fontWeight: 'bold'
                                }}
                              >
                                {contact.name}
                              </div>

                              <div
                                style={{
                                  opacity: 0.7,
                                  fontSize: '14px',
                                  marginTop: '4px'
                                }}
                              >
                                {contact.relation}
                              </div>

                              <div
                                style={{
                                  marginTop: '10px',
                                  fontStyle: 'italic',
                                  opacity: 0.8
                                }}
                              >
                                “{contact.message}”
                              </div>

                            </div>

                          ))}

                        </div>
                      </div>

                      {/* emergencia */}
                      <div>
                        <h3>Contacto prioritario</h3>

                        <div>
                          {emergencyContact}
                        </div>
                      </div>

                    </div>

                  </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile
                      ? '1fr'
                      : '1fr 1fr',
                    gap: '35px 40px'
                  }}
                >
                  {step.fields.map((field) => (
                    <div key={field.name}>
                      <label
                        style={{
                          fontWeight: 'bold',
                          marginRight: '10px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {field.label}
                      </label>

                      {field.type === 'file' ? (
                        <div>
                          {!imagePreview ? (
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '180px',
                                height: '180px',
                                border:
                                  '2px dashed #9aaed1',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                background:
                                  'rgba(24,74,150,0.03)',
                                color: '#184a96',
                                flexDirection: 'column',
                                gap: '10px'
                              }}
                            >
                              <div
                                style={{
                                  fontSize: isMobile
                                    ? '28px'
                                    : '42px'
                                }}
                              >
                                📷
                              </div>

                              <div>
                                Subir fotografía
                              </div>

                              <div
                                style={{
                                  fontSize: '12px',
                                  opacity: 0.7
                                }}
                              >
                                JPG o PNG
                              </div>

                              <input
                                type="file"
                                name={field.name}
                                accept="image/*"
                                style={{
                                  display: 'none'
                                }}
                                onChange={(e) => {
                                  const file =
                                    e.target.files[0]

                                  if (file) {
                                    const imageUrl =
                                      URL.createObjectURL(
                                        file
                                      )

                                    setImagePreview(
                                      imageUrl
                                    )
                                    setImageFile(file)
                                  }
                                }}
                              />
                            </label>
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                              }}
                            >
                              <img
                                src={imagePreview}
                                alt="preview"
                                style={{
                                  width: '180px',
                                  height: '180px',
                                  objectFit: 'cover',
                                  borderRadius: '12px',
                                  border:
                                    '2px solid #9aaed1'
                                }}
                              />

                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px'
                                }}
                              >
                                <label
                                  style={{
                                    cursor: 'pointer',
                                    color: '#184a96',
                                    fontSize: '14px'
                                  }}
                                >
                                  Cambiar

                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{
                                      display: 'none'
                                    }}
                                    onChange={(e) => {
                                      const file =
                                        e.target.files[0]

                                      if (file) {
                                        const imageUrl =
                                          URL.createObjectURL(
                                            file
                                          )

                                        setImagePreview(
                                          imageUrl
                                        )
                                        setImageFile(file)
                                      }
                                    }}
                                  />
                                </label>

                               <button
                                 type="button"
                                 onClick={() => {
                                   setImagePreview(null)
                                   setImageFile(null)
                                 }}
                                  style={{
                                    background:
                                      'transparent',
                                    border: 'none',
                                    color: '#b42323',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : field.type ===
                        'textarea' ? (
                        <textarea
                          name={field.name}

                          value={data[field.name] || ''}

                          onChange={(e) =>
                            setField(field.name, e.target.value)
                          }
                          style={{
                            width: '100%',
                            border: 'none',
                            borderBottom:
                              '2px solid #9aaed1',
                            background:
                              'transparent',
                            padding: '8px 4px',
                            outline: 'none',
                            color: '#184a96',
                            resize: 'none',
                            fontSize: '16px'
                          }}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={data[field.name] || ''}

                          onChange={(e) =>
                            setField(field.name, e.target.value)
                          }
                          style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: '2px solid #9aaed1',
                            background: 'transparent',
                            padding: '8px 4px',
                            outline: 'none',
                            color: '#184a96',
                            fontSize: '16px'
                          }}
                        >
                          <option value="">
                            Seleccione...
                          </option>

                          {field.options.map((option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.name}

                          value={data[field.name] || ''}

                          onChange={(e) =>
                            setField(field.name, e.target.value)
                          }

                          placeholder={field.placeholder || ''}
                          style={{
                            width: '100%',
                            border: 'none',
                            borderBottom:
                              '2px solid #9aaed1',
                            background:
                              'transparent',
                            padding: '8px 4px',
                            outline: 'none',
                            color: '#184a96',
                            fontSize: '16px'
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* botón */}
              <div
                style={{
                  marginTop: '50px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}
              >

                {/* volver */}
                {stepIndex > 0 && (

                  <button
                    type="button"

                    onClick={() => {

                      prevStep()

                      setPhase('form')
                    }}

                    style={{
                      background: 'transparent',
                      color: '#184a96',
                      border: '2px solid #184a96',
                      padding: '14px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Volver
                  </button>

                )}

                {/* continuar */}
                <button
                  type="submit"
                  disabled={
                    (step.type === 'stats' &&
                      remainingPoints > 0)

                    ||

                    (step.type === 'stats' &&
                      (
                        !statReasons.fisico ||
                        !statReasons.mental ||
                        !statReasons.interaccion
                      ))

                    ||

                    (step.type === 'contacts' &&
                      contacts.some(
                        (c) =>
                          !c.name ||
                          !c.relation ||
                          !c.message
                      ))

                    ||

                    (step.type === 'emergencyContact' &&
                      !emergencyContact)
                  }

                  style={{
                    background: '#184a96',
                    color: 'white',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    opacity:
                      (
                        (step.type === 'stats' &&
                          remainingPoints > 0)

                        ||

                        (step.type === 'stats' &&
                          (
                            !statReasons.fisico ||
                            !statReasons.mental ||
                            !statReasons.interaccion
                          ))

                        ||

                        (step.type === 'contacts' &&
                          contacts.some(
                            (c) =>
                              !c.name ||
                              !c.relation ||
                              !c.message
                          ))

                        ||

                        (step.type === 'emergencyContact' &&
                          !emergencyContact)
                      )
                        ? 0.5
                        : 1,
                  }}
                >
                  {
                    step.type === 'summary'
                      ? 'Confirmar y finalizar'
                      : 'Continuar'
                  }
                </button>

              </div>
            </form>
          </div>
        </>
      )}
  {finalizing && (

    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        zIndex: 9999,

        flexDirection: 'column',

        color: 'white',

        textAlign: 'center',

        padding: '30px'
      }}
    >

      <div
        style={{
          fontSize: isMobile ? '30px' : '46px',
          fontWeight: 'bold',
          marginBottom: '20px',
          letterSpacing: '1px'
        }}
      >
        Evaluación completada
      </div>

      <div
        style={{
          opacity: 0.7,
          maxWidth: '600px',
          lineHeight: 1.6,
          fontSize: isMobile ? '16px' : '20px'
        }}
      >
        El perfil psicológico del sujeto ha sido archivado correctamente.
      </div>

      <div
        style={{
          marginTop: '40px',
          opacity: 0.45,
          fontSize: '14px',
          letterSpacing: '3px'
        }}
      >
        REDIRIGIENDO...
      </div>

    </div>

  )}
    </div>
  )
}