import { useState } from "react"
import { Player } from "../../lib/types/player"
import "../../styles/modal.css"

interface Props {
  healAvailable: boolean
  poisonAvailable: boolean
  lastWolfTarget: Player | undefined
  players: Player[]
  onConfirm: (payload: { heal?: boolean; poisonTarget?: number }) => void
  onCancel: () => void
}

export default function ActionWitch({
  healAvailable,
  poisonAvailable,
  lastWolfTarget,
  players,
  onConfirm,
  onCancel,
}: Props) {
  const [heal, setHeal] = useState(false)
  const [poisonTarget, setPoisonTarget] = useState<number | undefined>()

  const handleConfirm = () => {
    onConfirm({ heal: heal || undefined, poisonTarget })
  }

  const toggleHeal = () => {
    if (healAvailable) {
      setHeal(!heal)
    }
  }

  return (
    <div className="modal-box">
      <h3>Acciones de la Bruja</h3>

      <div className="modal-content">
        {healAvailable && lastWolfTarget && (
          <div>
            <p>Los lobos han atacado a <b>{lastWolfTarget.name}</b></p>
            <div className="modal-content modal-heal">
              <button
                className={heal ? 'selected' : ''}
                onClick={() => toggleHeal()}
              >
                Curar
              </button>
            </div>
          </div>
        )}

        {poisonAvailable && (
          <div>
            <p>Elige a alguien para envenenar:</p>
            <div className="modal-content modal-players">
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (poisonTarget === p.id) {
                      setPoisonTarget(undefined)
                    } else {
                      setPoisonTarget(p.id)
                    }
                  }}
                  className={poisonTarget === p.id ? 'selected' : ''}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button onClick={onCancel} className="cancel">Cancelar</button>
        <button onClick={handleConfirm} className="confirm">Confirmar</button>
      </div>
    </div>
  )
}
