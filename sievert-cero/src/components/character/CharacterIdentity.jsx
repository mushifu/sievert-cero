export default function CharacterIdentity({
  character,
  editing = false,
  onChange = () => {},
  isMobile = false
}) {

  return (
    <div>

      {/* nombre */}
      <div
        style={{
          marginBottom: '20px'
        }}
      >

        {editing ? (

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile
                ? 'column'
                : 'row',

              gap: '12px'
            }}
          >

            <input
              value={character.Nombre || ''}

              onChange={(e) =>
                onChange(
                  'Nombre',
                  e.target.value
                )
              }

              placeholder="Nombre"

              style={{
                flex: 1,

                background: 'transparent',

                border: 'none',

                borderBottom:
                  '1px solid rgba(255,255,255,0.2)',

                color: 'white',

                fontSize: isMobile
                  ? '32px'
                  : '68px',

                outline: 'none',

                paddingBottom: '8px'
              }}
            />

            <input
              value={character.Apellidos || ''}

              onChange={(e) =>
                onChange(
                  'Apellidos',
                  e.target.value
                )
              }

              placeholder="Apellidos"

              style={{
                flex: 1,

                background: 'transparent',

                border: 'none',

                borderBottom:
                  '1px solid rgba(255,255,255,0.2)',

                color: 'white',

                fontSize: isMobile
                  ? '32px'
                  : '68px',

                outline: 'none',

                paddingBottom: '8px'
              }}
            />

          </div>

        ) : (

          <h1
            style={{
              margin: 0,
              lineHeight: 1.1
            }}
          >
            {character.Nombre}{' '}
            {character.Apellidos}
          </h1>

        )}

      </div>

      {/* género + ocupación */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile
            ? 'column'
            : 'row',

          gap: '20px',

          marginBottom: '30px'
        }}
      >

        {editing ? (

          <>

            <select
              value={character.Genero || ''}

              onChange={(e) =>
                onChange(
                  'Genero',
                  e.target.value
                )
              }

              style={{
                flex: 1,

                background:
                  'rgba(255,255,255,0.05)',

                border:
                  '1px solid rgba(255,255,255,0.1)',

                borderRadius: '10px',

                color: 'white',

                padding: '12px',

                outline: 'none'
              }}
            >
              <option value="">
                Seleccionar género
              </option>

              <option value="Masculino">
                Masculino
              </option>

              <option value="Femenino">
                Femenino
              </option>

              <option value="Otro">
                Otro
              </option>

            </select>

            <input
              value={character.Ocupación || ''}

              onChange={(e) =>
                onChange(
                  'Ocupación',
                  e.target.value
                )
              }

              placeholder="Ocupación"

              style={{
                flex: 1,

                background:
                  'rgba(255,255,255,0.05)',

                border:
                  '1px solid rgba(255,255,255,0.1)',

                borderRadius: '10px',

                color: 'white',

                padding: '12px',

                outline: 'none'
              }}
            />

          </>

        ) : (

          <div
            style={{
              opacity: 0.7,
              fontSize: '16px'
            }}
          >
            {character.Genero || 'Sin género'}
            {' • '}
            {character.Ocupación || 'Sin ocupación'}
          </div>

        )}

      </div>

    </div>
  )
}