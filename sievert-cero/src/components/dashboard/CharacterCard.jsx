import styles
  from './CharacterCard.module.css'

export default function CharacterCard({
  character,
  isMaster = false,
  onOpen = () => {},
  onDelete = () => {}
}) {

  return (

    <div className={styles.wrapper}>

      {/* BORRAR */}
      <button
        type="button"
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation()
          onDelete(character)

        }}
      >🗑</button>

      {/* CARD */}
      <button
        type="button"
        className={styles.card}
        onClick={() =>
          onOpen(character)
        }
      >

        {/* IMAGEN */}
        <div
          className={styles.image}
          style={{
            backgroundImage:
              character.Imagen
                ? `url(${character.Imagen})`
                : 'none',
            backgroundColor:
              character.Imagen
                ? undefined
                : '#222'
          }}
        >
          <div className={styles.overlay} />
        </div>

        {/* INFO */}
        <div className={styles.info}>
          {isMaster && (
            <div className={styles.masterBadge}>
              {character.Usuario?.username || 'desconocido'}
            </div>
          )}

          <div className={styles.name}>
            {character.Nombre}{' '}
            {character.Apellidos}
          </div>

          <div className={styles.meta}>
            {character.Genero || 'Sin género'}
            {' • '}
            {character.Ocupación || 'Sin ocupación'}
          </div>

          <div className={styles.stats}>
            <div>💪 {character['Físico']}</div>
            <div>🧠 {character['Cognición']}</div>
            <div>🗣 {character['Interacción']}</div>
          </div>
        </div>
      </button>
    </div>
  )
}