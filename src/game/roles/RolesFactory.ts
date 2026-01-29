import { WolfRole } from './WolfRole'
import { Player } from '../../lib/types/player'
import { Powers, Role, RoleKey } from '../../lib/types/role'
import { PlaceholderRole } from './Placeholder'
import { WitchRole } from './WitchRole'

export class RolesFactory {
  static createRole(key: RoleKey, players: Player[], assigned: number[], powers: Powers): Role {
    switch (key) {
      case 'lobo':
        return new WolfRole(players, assigned)
      case 'bruja':
        return new WitchRole(players, assigned, powers.witch.healAvailable, powers.witch.poisonAvailable)
      default:
        return new PlaceholderRole(players, assigned)
    }
  }
}
