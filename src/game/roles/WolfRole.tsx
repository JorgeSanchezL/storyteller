import { Player, PlayerState } from "../../lib/types/player"
import { Role, RoleKey } from "../../lib/types/role"
import SimpleSelection from "../modals/SimpleSelection"

import "../../styles/role.css"

export class WolfRole extends Role {
  constructor(players: Player[], assignedIds: number[]) {
    super("lobo" as RoleKey, assignedIds.length > 1 ? "Lobos" : "Lobo", players, assignedIds)
  }

  render(onAssign: () => void, onAction: () => void) {
    const alive = this.assignedPlayers.filter(p => p.state !== PlayerState.Dead)

    return (
      <div key={this.key} className="role-card" style={{ borderColor: this.statusColor }}>
        <span className="role-label">{this.label}</span>
        <div className="role-actions">
          <button className="assign" onClick={onAssign}>Asignar</button>
          <button className="action" onClick={onAction} disabled={alive.length === 0}>
            Atacar
          </button>
        </div>
      </div>
    )
  }

  renderActionModal(
    onConfirm: (payload: Record<string, unknown>) => void,
    onCancel: () => void,
    players: Player[]
  ) {
    const targets = players.filter(p => p.state !== PlayerState.Dead && !this.assignedIds.includes(p.id))

    return (
      <SimpleSelection
        players={targets}
        onConfirm={(targetId) => {
          const payload = { target: targetId }
          onConfirm(payload)
          const target = this.players.find(p => p.id === targetId)
          if (target) target.state = PlayerState.Wounded
        }}
        onCancel={onCancel}
      />
    )
  }
}
