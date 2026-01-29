import { Player } from '../../lib/types/player'
import "../../styles/modal.css"

interface Props {
  availablePlayers: Player[]
  selectedPlayers: number[]
  setSelectedPlayers: (ids: number[]) => void
  onConfirm: () => void
  onCancel: () => void
  requiredCount: number
  roleLabel: string
}

export default function Assign({
  availablePlayers,
  selectedPlayers,
  setSelectedPlayers,
  onConfirm,
  onCancel,
  requiredCount,
  roleLabel,
}: Props) {
  const toggle = (id: number) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== id))
    } else if (selectedPlayers.length < requiredCount) {
      setSelectedPlayers([...selectedPlayers, id])
    }
  }

  return (
    <div className="modal-box">
      <h3>Asignar {roleLabel} ({selectedPlayers.length}/{requiredCount})</h3>
      <div className="modal-content modal-players">
        {availablePlayers.map(p => (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={selectedPlayers.includes(p.id) ? 'selected' : ''}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="modal-actions">
        <button onClick={onCancel} className="cancel">Cancelar</button>
        <button
          onClick={onConfirm}
          disabled={selectedPlayers.length !== requiredCount}
          className="confirm"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
