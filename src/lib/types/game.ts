import type { Player } from "./player"
import type { Assignment, Powers, RoleKey } from "./role"
import { PlayerState } from "./player"

export interface Decision {
  role: RoleKey
  round: number
  payload: Record<string, unknown>
  at: number
}

export interface GameState {
  playerCount: number
  rolesInGame: RoleKey[]
  players: Player[]
  assignments: Assignment
  round: number
  decisions: Decision[]
  createdAt: number
  powers: Powers
  winner?: "lobos" | "aldeanos" | null
}

export class Game implements GameState {
  playerCount: number
  rolesInGame: RoleKey[]
  players: Player[]
  assignments: Assignment
  round: number
  decisions: Decision[]
  createdAt: number
  powers: Powers
  winner?: "lobos" | "aldeanos" | null

  constructor(state: GameState) {
    this.playerCount = state.playerCount
    this.rolesInGame = state.rolesInGame
    this.players = state.players
    this.assignments = state.assignments
    this.round = state.round
    this.decisions = state.decisions
    this.createdAt = state.createdAt
    this.powers = state.powers
    this.winner = state.winner ?? null

    if (this.powers === undefined) {
      this.powers = {
        witch: {
          healAvailable: true,
          poisonAvailable: true,
        },
      }
    }
  }

  processCurrentRound() {
    const roundDecisions = this.decisions.filter(d => d.round === this.round)
    for (const d of roundDecisions) {
      if (d.role === 'bruja') {
        if (d.payload.heal) {
          const wounded = this.players.find(p => p.state === PlayerState.Wounded)
          if (wounded) wounded.state = PlayerState.Alive
          this.powers.witch.healAvailable = false
        }
        if (d.payload.poisonTarget) {
          const targetId = d.payload.poisonTarget as number
          const target = this.players.find(p => p.id === targetId)
          if (target) target.state = PlayerState.Dead
          this.powers.witch.poisonAvailable = false
        }
      }
    }

    const wounded = this.players.filter(p => p.state === PlayerState.Wounded)
    wounded.map(p => p.state = PlayerState.Dead)

    this.checkWinner()
  }

  private checkWinner() {
    const wolves = this.getAliveByRole("lobo").length
    const villagers = this.players.filter(
      p => p.state !== PlayerState.Dead && !this.isWolf(p.id)
    ).length

    if (wolves === 0) {
      this.winner = "aldeanos"
    } else if (wolves >= villagers) {
      this.winner = "lobos"
    }
  }

  private getAliveByRole(role: RoleKey): Player[] {
    const ids = this.assignments[role]
    const assignedIds = Array.isArray(ids) ? ids : ids ? [ids] : []
    return this.players.filter(
      p => assignedIds.includes(p.id) && p.state !== PlayerState.Dead
    )
  }

  private isWolf(playerId: number): boolean {
    const ids = this.assignments["lobo"]
    const wolfIds = Array.isArray(ids) ? ids : ids ? [ids] : []
    return wolfIds.includes(playerId)
  }
}
