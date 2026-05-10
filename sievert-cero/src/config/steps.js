export const steps = [
  {
    id: 'intro',
    video: '/videos/001_psico_intro_datos.mp4',
    mobilePosition: '55% center',
    fields: [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true
      },
      {
          name: 'apellidos',
          label: 'Apellidos',
          type: 'text',
        },
        {
          name: 'genero',
          label: 'Género',
          type: 'select',
          options: [
            'Masculino',
            'Femenino',
            'Otros'
          ],
          required: true
        },
      {
        name: 'edad',
        label: 'Edad',
        type: 'number'
      },
      {
        name: 'ocupacion',
        label: 'Ocupación',
        type: 'text',
      },
      {
        name: 'foto',
        label: 'Foto del paciente',
        type: 'file'
      }
    ]
  },
  {
    id: 'stats',
    video: '/videos/002_psico_stats.mp4',
    mobilePosition: '35% center',
    type: 'stats'
  },
  {
      id: 'recuerdos',
      video: '/videos/003_psico_recuerdos.mp4',
      mobilePosition: '35% center',
      fields: [
          {
            name: 'buenRecuerdo',
            label: 'Describa un recuerdo feliz de su vida',
            type: 'textarea',
            placeholder: '¿Qué ocurrió? ¿Quién estaba allí? ¿Por qué fue importante para usted?',
            required: true
          },
          {
            name: 'malRecuerdo',
            label: 'Describa un recuerdo doloroso o traumático',
            type: 'textarea',
            placeholder: 'Explique qué ocurrió y cómo le afectó.',
            required: true
          }
        ]
    },
    {
        id: 'contactos',
        video: '/videos/004_psico_contactos.mp4',
        mobilePosition: '35% center',
        type: 'contacts'
      },
      {
          id: 'emergencia',
          video: '/videos/005_psico_emergencia.mp4',
          mobilePosition: '35% center',
          type: 'emergencyContact'
        },
        {
            id: 'despedida',
            video: '/videos/006_psico_despedida.mp4',
            mobilePosition: '35% center',
            type: 'summary'
          },
]