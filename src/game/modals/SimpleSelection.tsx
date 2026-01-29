import { Player } from '../../lib/types/player'
import "../../styles/modal.css"

interface Props {
  players: Player[]
  onConfirm: (id: number) => void
  onCancel: () => void
}

export default function SimpleSelection({ players, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-box">
      <h3>Elige un objetivo</h3>
      <div className="modal-content modal-players">
        {players.map(p => (
          <button key={p.id} onClick={() => onConfirm(p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      <div className="modal-actions">
        <button onClick={onCancel} className="cancel">Cancelar</button>
      </div>
    </div>
  )
}
