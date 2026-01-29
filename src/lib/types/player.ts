export enum PlayerState {
  Alive = 'alive',
  Wounded = 'wounded',
  Dead = 'dead',
}

export interface Player {
  id: number
  name: string
  state: PlayerState
}