import styles from './CharacterStats.module.css'
import {
  useState,
  useEffect
} from 'react'

export default function CharacterStats({
  character,
  isMobile = false,
  editing = false,
  onTraitsChange = () => {}
}) {

  const razones =
    character.Rasgos?.razonesStats || {}

  const rasgos =
    character.Rasgos?.rasgos || {
      fisico: [],
      mental: [],
      interaccion: []
    }

  const [editableRasgos, setEditableRasgos] =
    useState(rasgos)

  useEffect(() => {

    onTraitsChange(editableRasgos)

  }, [editableRasgos])

  const stats = [
    {
      key: 'fisico',
      label: 'Físico',
      value: character['Físico'],
      icon: '💪'
    },

    {
      key: 'mental',
      label: 'Cognición',
      value: character['Cognición'],
      icon: '🧠'
    },

    {
      key: 'interaccion',
      label: 'Interacción',
      value: character['Interacción'],
      icon: '🗣'
    }
  ]

  const increaseTrait = (
    statKey,
    index,
    maxPoints
  ) => {

    const currentTraits =
      editableRasgos[statKey]

    const totalUsed =
      currentTraits.reduce(
        (sum, trait) =>
          sum + (trait.nivel || 0),
        0
      )

    if (totalUsed >= maxPoints) return

    const updated = [...currentTraits]

    const currentLevel =
      updated[index].nivel || 0

    if (currentLevel >= 3) return

    updated[index] = {
      ...updated[index],
      nivel: currentLevel + 1
    }

    setEditableRasgos((prev) => ({
      ...prev,
      [statKey]: updated
    }))
  }

  const decreaseTrait = (
    statKey,
    index
  ) => {

    const updated = [
      ...editableRasgos[statKey]
    ]

    const currentLevel =
      updated[index].nivel || 0

    if (currentLevel <= 0) return

    updated[index] = {
      ...updated[index],
      nivel: currentLevel - 1
    }

    setEditableRasgos((prev) => ({
      ...prev,
      [statKey]: updated
    }))
  }

  return (

    <div
      style={{
        display: 'grid',

        gridTemplateColumns:
          isMobile
            ? '1fr'
            : 'repeat(3, 1fr)',

        gap: '20px',

        marginBottom: '50px'
      }}
    >

      {stats.map((stat) => {

        const usedPoints =
          editableRasgos[stat.key]
            ?.reduce(
              (sum, t) =>
                sum + (t.nivel || 0),
              0
            ) || 0

        const remaining =
          stat.value - usedPoints

        return (

          <div
            key={stat.key}

            style={{
              background:
                'rgba(255,255,255,0.04)',

              borderRadius: '24px',

              padding: '30px'
            }}
          >

            <div
              style={{
                fontSize: '42px',
                marginBottom: '12px'
              }}
            >
              {stat.icon}
            </div>

            <div
              style={{
                opacity: 0.7,
                marginBottom: '8px'
              }}
            >
              {stat.label}
            </div>

            <div
              style={{
                fontSize: '42px',
                fontWeight: 'bold'
              }}
            >
              {stat.value}
            </div>

            {editing && (

              <div className={styles.remaining}>
                Restantes: {remaining}
              </div>

            )}

            <div
              style={{
                marginTop: '16px',
                opacity: 0.7,
                lineHeight: 1.5
              }}
            >
              {razones[stat.key]}
            </div>

            {editableRasgos[stat.key]?.length > 0 && (

              <div className={styles.traits}>

                {editableRasgos[stat.key]
                  .map((trait, index) => {

                    const nivel =
                      trait.nivel || 0

                    // ocultar rasgos vacíos fuera de edición
                    if (!editing && nivel <= 0) {
                      return null
                    }

                    return (

                      <div
                        key={trait.nombre}
                        className={styles.trait}
                      >

                        <div>
                          {trait.nombre}
                        </div>

                        {trait.descripcion && (

                          <div
                            className={
                              styles.traitDescription
                            }
                          >
                            {trait.descripcion}
                          </div>

                        )}

                        {/* vista normal */}
                        {!editing && nivel > 0 && (

                          <div
                            className={
                              styles.levelDots
                            }
                          >

                            {[1, 2, 3].map((dot) => (

                              <span
                                key={dot}

                                className={
                                  dot <= nivel
                                    ? styles.levelDotActive
                                    : styles.levelDot
                                }
                              />

                            ))}

                          </div>

                        )}

                        {/* edición */}
                        {editing && (

                          <div
                            className={
                              styles.levelEditor
                            }
                          >

                            <button
                              type="button"

                              className={
                                styles.levelButton
                              }

                              onClick={() =>
                                decreaseTrait(
                                  stat.key,
                                  index
                                )
                              }
                            >
                              −
                            </button>

                            <div
                              className={
                                styles.levelValue
                              }
                            >
                              {nivel}
                            </div>

                            <button
                              type="button"

                              className={
                                styles.levelButton
                              }

                              onClick={() =>
                                increaseTrait(
                                  stat.key,
                                  index,
                                  stat.value
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                        )}

                      </div>

                    )

                  })}

              </div>

            )}

          </div>

        )

      })}

    </div>

  )
}