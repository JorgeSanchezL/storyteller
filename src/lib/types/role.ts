import type { JSX } from "react"
import { type Player } from "./player"
import { WitchPowers } from "../../game/roles/WitchRole"

export interface Powers {
  witch: WitchPowers
}

export type RoleKey =
  | 'lobo'
  | 'bruja'
  | 'placeholder'

export interface RoleDef {
  key: RoleKey
  name: string
  order: number
  firstNightOnly?: boolean
  multiplePlayers?: boolean
}

export type Assignment = {
  [role in RoleKey]?: number | number[]
}

export const DEFAULT_ROLES: RoleDef[] = [
  { key: 'lobo', name: 'Lobo', order: 30, multiplePlayers: true },
  { key: 'bruja', name: 'Bruja', order: 50 },
]

export abstract class Role {
  key: RoleKey
  label: string
  players: Player[]
  assignedIds: number[]

  constructor(key: RoleKey, label: string, players: Player[], assignedIds: number[]) {
    this.key = key
    this.label = label
    this.players = players
    this.assignedIds = assignedIds
  }

  get assignedPlayers() {
    return this.players.filter(p => this.assignedIds.includes(p.id))
  }

  get statusColor(): string {
    if (this.assignedIds.length === 0) return "lightgray"
    if (this.assignedPlayers.every(p => p.state === "dead")) return "red"
    return "green"
  }

  abstract render(onAssign: () => void, onAction: () => void): JSX.Element

  abstract renderActionModal(
    onConfirm: (decision: Record<string, unknown>) => void,
    onCancel: () => void,
    allPlayers: Player[]
  ): JSX.Element | null
}
