import { Player, PlayerState } from '../../lib/types/player'
import { Role } from '../../lib/types/role'
import ActionWitch from '../modals/WitchAction'

import "../../styles/role.css"

export interface WitchPowers {
  healAvailable: boolean
  poisonAvailable: boolean
}

export class WitchRole extends Role {
  private healAvailable: boolean
  private poisonAvailable: boolean

  constructor(players: Player[], assigned: number[], healAvailable: boolean, poisonAvailable: boolean) {
    super('bruja', 'Bruja', players, assigned)
    this.healAvailable = healAvailable
    this.poisonAvailable = poisonAvailable
  }

  render(onAssign: () => void, onAction: () => void) {
    const alive = this.assignedPlayers.filter(p => p.state !== PlayerState.Dead)

    return (
      <div key={this.key} className="role-card" style={{ borderColor: this.statusColor }}>
        <span className="role-label">
          {this.label} 
          {!this.healAvailable && ' 🧴 usado'} 
          {!this.poisonAvailable && ' ☠️ usado'}
        </span>
        <div className="role-actions">
          <button className="assign" onClick={onAssign}>Asignar</button>
          <button className="action" onClick={onAction} disabled={alive.length === 0 || (!this.healAvailable && !this.poisonAvailable)}>
            Acción
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
      <ActionWitch
        healAvailable={this.healAvailable}
        poisonAvailable={this.poisonAvailable}
        lastWolfTarget={players.find(p => p.state === PlayerState.Wounded)}
        players={targets}
        onConfirm={(payload) => {
          if (payload.heal) this.healAvailable = false
          if (payload.poisonTarget) this.poisonAvailable = false
          onConfirm(payload)
        }}
        onCancel={onCancel}
      />
    )
  }
}
