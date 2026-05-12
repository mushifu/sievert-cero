import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import CharacterCard from '../components/dashboard/CharacterCard'
import styles from './Dashboard.module.css'

export default function Dashboard() {

  const user =
    useAuthStore((state) => state.user)

  const logout =
    useAuthStore((state) => state.logout)

  const [personajes, setPersonajes] =
    useState([])

  const navigate = useNavigate()

  useEffect(() => {
    loadPersonajes()
  }, [])

  const loadPersonajes = async () => {

    let query = supabase
      .from('Sievert_PJ')
      .select(`
        *,
        Usuario!Sievert_PJ_user_id_fkey (
          username
        )
      `)

    // si NO es master -> solo sus personajes
    if (user.username !== 'master') {

      query = query.eq(
        'user_id',
        user.id
      )
    }

    const { data, error } = await query

    if (data) {

      setPersonajes(data)

    } else {

      console.error(error)
    }
  }

  return (

    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.topBar}>

        <div className={styles.header}>

          <div className={styles.greeting}>
            Hola, {
              user.username.charAt(0).toUpperCase() +
              user.username.slice(1)
            }
          </div>

          <h1 className={styles.title}>
            Tus personajes
          </h1>

          <div className={styles.subtitle}>
            {personajes.length} personajes
          </div>

        </div>

        <div className={styles.actions}>

          <button
            className={styles.logoutButton}

            onClick={() => {

              logout()

              navigate('/login')

            }}
          >
            Cerrar sesión
          </button>

        </div>

      </div>

      {/* GRID */}
      <div className={styles.grid}>

        {/* PERSONAJES */}
        {personajes.map((p) => (

          <CharacterCard
            key={p.id}
            character={p}
            isMaster={
              user.username === 'master'
            }
            onOpen={(character) =>
              navigate(
                `/personaje/${character.id}`
              )
            }
            onDelete={async (character) => {
              const confirmed =
                window.confirm(
                  `¿Eliminar a ${character.Nombre}?`
                )

              if (!confirmed) return

              const { error } = await supabase
                .from('Sievert_PJ')
                .delete()
                .eq('id', character.id)

              if (error) {
                console.error(error)
                alert(
                  'Error eliminando personaje'
                )
                return
              }
              setPersonajes((prev) =>
                prev.filter(
                  (char) =>
                    char.id !== character.id
                )
              )
            }}
          />
        ))}

        {/* CREAR */}
        <button
          className={styles.createCard}
          onClick={() =>
            navigate('/crear')
          }
        >
          <div className={styles.createIcon}>+</div>
          <div>Nuevo personaje</div>
        </button>
      </div>
    </div>
  )
}