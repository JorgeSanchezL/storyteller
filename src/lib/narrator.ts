import { Decision } from "./types/game"
import { Player } from "./types/player"

export function summarizeRound(
  decisions: Decision[],
  players: Player[]
): string[] {
  const logs: string[] = []

  for (const d of decisions) {
    switch (d.role) {
      case "lobo": {
        const targetId = d.payload["target"] as number
        const target = players.find(p => p.id === targetId)
        if (target) {
          logs.push(`Los lobos atacaron a ${target.name}.`)
        }
        break
      }

      case "bruja": {
        console.log(d.payload)
        if (d.payload["heal"]) {
          logs.push(`La bruja usó su poción de curación y salvó a la víctima de los lobos.`)
        }
        if (d.payload["poisonTarget"]) {
          const poisonId = d.payload["poisonTarget"] as number
          const poisoned = players.find(p => p.id === poisonId)
          if (poisoned) {
            logs.push(`La bruja envenenó a ${poisoned.name}.`)
          }
        }
        break
      }

      default:
        logs.push(`El rol ${d.role} actuó.`)
    }
  }

  if (logs.length === 0) {
    logs.push("Esta noche no ocurrió nada.")
  }

  return logs
}
