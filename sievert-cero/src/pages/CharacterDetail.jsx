import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import CharacterIdentity from '../components/character/CharacterIdentity'
import CharacterMemories from '../components/character/CharacterMemories'
import CharacterStats from '../components/character/CharacterStats'
import CharacterContacts from '../components/character/CharacterContacts'
import styles from './CharacterDetail.module.css'
import { useAuthStore } from '../store/authStore'

export default function CharacterDetail() {

  const { id } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editedCharacter, setEditedCharacter] = useState(null)
  const isMobile = window.innerWidth < 768
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
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
    setEditedCharacter(data)
  }

  const updateField = (
    field,
    value
  ) => {
    setEditedCharacter((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const cancelEditing = () => {
    setEditedCharacter(character)
    setEditing(false)
  }

  const saveCharacter = async () => {

    const { error } = await supabase
      .from('Sievert_PJ')
      .update({
        Nombre: editedCharacter.Nombre,
        Apellidos:editedCharacter.Apellidos,
        Genero: editedCharacter.Genero,
        Ocupación: editedCharacter.Ocupación,
        Rec_bueno: editedCharacter.Rec_bueno,
        Rec_malo: editedCharacter.Rec_malo,
        Rasgos: editedCharacter.Rasgos
      })
      .eq('id', character.id)

    if (error) {
      console.error(error)
      alert('Error guardando cambios')
      return
    }
    setCharacter(editedCharacter)
    setEditing(false)
    alert('Cambios guardados')
  }

  if (!character) {
    return (
      <div className={styles.loading}>
        Cargando sujeto...
      </div>
    )
  }

  const contactos = character.Contactos?.contactos || []

  const emergencia = character.Contactos?.contactoEmergencia

  const razones = character.Rasgos?.razonesStats || {}
  const rasgos =
    character.Rasgos?.rasgos || {
      fisico: [],
      mental: [],
      interaccion: []
    }

  return (
      <div className={styles.page}>

      {/* HERO */}
      <div
        className={`
          ${styles.hero}
          ${
            isMobile
              ? styles.heroMobile
              : styles.heroDesktop
          }
        `}
>

        {/* imagen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              character.Imagen
                ? `url(${character.Imagen}) center/cover`
                : '#111'
          }}
        />

        {/* overlay */}
        <div className={styles.heroOverlay} />

        {/* volver */}
        <button className={styles.backButton} onClick={() => navigate('/')}>← Volver</button>

        {/* master */}
        {user?.username === 'master' && (

          <button
            onClick={() =>
              navigate(
                `/master/personaje/${id}`
              )
            }

            className={styles.masterButton}
          >
            Vista master
          </button>

        )}

        {/* Edición */}
        <div className={styles.editPanel}>
          {!editing ? (
            <button className={styles.editButton}
              onClick={() =>
                setEditing(true)
              }
            >
              Editar personaje
            </button>
          ) : (
            <>
              <button onClick={saveCharacter} className={styles.saveButton}>Guardar cambios</button>
              <button onClick={cancelEditing} className={styles.cancelButton}>Cancelar</button>
            </>
          )}
        </div>
        {/* info */}
        <div className={styles.heroInfo}>
          <div className={styles.subjectLabel}>SUJETO REGISTRADO</div>
          <CharacterIdentity
            character={
              editing
                ? editedCharacter
                : character
            }
            editing={editing}
            onChange={updateField}
            isMobile={isMobile}
          />
        </div>
      </div>
      {/* contenido */}
      <div className={styles.content}>
        <CharacterStats
          character={
            editing
              ? editedCharacter
              : character
          }
            editing={editing}
          isMobile={isMobile}
          onTraitsChange={(traits) => {
            if (!editing) return
            setEditedCharacter((prev) => ({
              ...prev,
              Rasgos: {
                ...prev.Rasgos,
                rasgos: traits
              }
            }))
          }}
        />
        <CharacterMemories character={
            editing
              ? editedCharacter
              : character
          }
          editing={editing}
          onChange={updateField}
          isMobile={isMobile}
        />
        <CharacterContacts
          contactos={contactos}
          emergencia={emergencia}
        />
      </div>
    </div>
  )
}