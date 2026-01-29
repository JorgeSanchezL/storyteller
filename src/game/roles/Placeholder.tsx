import { PlayerState, type Player } from "../../lib/types/player"
import { Role } from "../../lib/types/role"
import SimpleSelection from "../modals/SimpleSelection"

export class PlaceholderRole extends Role {
  constructor(players: Player[], assigned: number[] = []) {
    super('placeholder', 'Placeholder', players, assigned)
  }

  render(_onAssign?: () => void, _onAction?: () => void) {
    return (
        <div key={this.key} style={{
            border: `2px solid ${this.statusColor}`,
            borderRadius: 8,
            padding: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span>{this.key}</span>
            <div style={{ display: 'flex', gap: 8 }}>
            </div>
        </div>
    )
  }

    renderActionModal(
    onConfirm: (payload: Record<string, unknown>) => void,
      onCancel: () => void,
      players: Player[]
    ) {
      const loboIds = this.assignedPlayers.map(p => p.id)
      const targets = players.filter(p => p.state !== PlayerState.Dead && !loboIds.includes(p.id))
  
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
