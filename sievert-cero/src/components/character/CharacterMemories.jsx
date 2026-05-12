export default function CharacterMemories({
  character,
  editing = false,
  onChange = () => {},
  isMobile = false
}) {

  const cardStyle = {
    background:
      'rgba(255,255,255,0.04)',

    borderRadius: '24px',

    padding: '30px'
  }

  const textStyle = {
    opacity: 0.8,
    lineHeight: 1.7
  }

  const inputStyle = {
    width: '100%',

    background: 'transparent',

    border: 'none',

    borderBottom:
      '1px solid rgba(255,255,255,0.2)',

    color: 'white',

    fontSize: '18px',

    outline: 'none',

    resize: 'vertical',

    minHeight: '120px'
  }

  return (
    <div
      style={{
        display: 'grid',

        gridTemplateColumns:
          isMobile
            ? '1fr'
            : '1fr 1fr',

        gap: '24px',

        marginBottom: '50px'
      }}
    >

      {/* buen recuerdo */}
      <div style={cardStyle}>

        <h2>
          Buen recuerdo
        </h2>

        {editing ? (

          <textarea
            value={
              character.Rec_bueno || ''
            }

            onChange={(e) =>
              onChange(
                'Rec_bueno',
                e.target.value
              )
            }

            style={inputStyle}
          />

        ) : (

          <div style={textStyle}>
            {character.Rec_bueno}
          </div>

        )}

      </div>

      {/* mal recuerdo */}
      <div style={cardStyle}>

        <h2>
          Mal recuerdo
        </h2>

        {editing ? (

          <textarea
            value={
              character.Rec_malo || ''
            }

            onChange={(e) =>
              onChange(
                'Rec_malo',
                e.target.value
              )
            }

            style={inputStyle}
          />

        ) : (

          <div style={textStyle}>
            {character.Rec_malo}
          </div>

        )}

      </div>

    </div>
  )
}