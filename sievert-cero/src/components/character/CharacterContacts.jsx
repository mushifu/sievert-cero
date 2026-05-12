export default function CharacterContacts({
  contactos = [],
  emergencia = ''
}) {

  return (
    <div
      style={{
        background:
          'rgba(255,255,255,0.04)',

        borderRadius: '24px',

        padding: '30px'
      }}
    >

      <h2
        style={{
          marginTop: 0,
          marginBottom: '30px'
        }}
      >
        Red de apoyo
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >

        {contactos.map((c, index) => (

          <div
            key={index}

            style={{
              padding: '20px',

              borderRadius: '18px',

              background:
                emergencia === c.name
                  ? 'rgba(24,74,150,0.25)'
                  : 'rgba(255,255,255,0.03)',

              border:
                emergencia === c.name
                  ? '1px solid rgba(90,140,255,0.4)'
                  : '1px solid rgba(255,255,255,0.04)'
            }}
          >

            <div
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}
            >
              {c.name}
            </div>

            <div
              style={{
                opacity: 0.7,
                marginBottom: '14px'
              }}
            >
              {c.relation}
            </div>

            <div
              style={{
                opacity: 0.85,
                fontStyle: 'italic'
              }}
            >
              “{c.message}”
            </div>

            {emergencia === c.name && (

              <div
                style={{
                  marginTop: '16px',

                  opacity: 0.8,

                  fontSize: '14px'
                }}
              >
                CONTACTO PRIORITARIO
              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  )
}