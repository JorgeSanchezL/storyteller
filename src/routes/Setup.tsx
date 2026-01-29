import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { save } from "../lib/storage"
import { DEFAULT_ROLES, type RoleKey } from "../lib/types/role"
import { PlayerState, type Player } from "../lib/types/player"
import "../styles/colors.css"
import "../styles/setup.css"
import NumberStepper from "../components/NumberStepper"

export default function Setup() {
  const nav = useNavigate()
  const [playerCount, setPlayerCount] = useState(8)
  const [rolesInGame, setRolesInGame] = useState<RoleKey[]>(["bruja"])
  const [loboCount, setLoboCount] = useState(1)
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: playerCount }, (_, i) => ({
      id: i + 1,
      name: "",
      state: PlayerState.Alive,
    }))
  )

  const toggleRole = (key: RoleKey) => {
    setRolesInGame(cur =>
      cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key]
    )
  }

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, name } : p)))
  }

  const startGame = () => {
    if (loboCount < 1) {
      alert("Debe haber al menos un lobo")
      return
    }
    const empty = players.find(p => !p.name.trim())
    if (empty) {
      alert(`Todos los jugadores deben tener nombre (jugador ${empty.id} vacío)`)
      return
    }

    const gameRoles: RoleKey[] = [...rolesInGame]
    for (let i = 0; i < loboCount; i++) {
      gameRoles.push("lobo")
    }

    const gameState = {
      playerCount,
      rolesInGame: gameRoles,
      players,
      assignments: {},
      round: 1,
      decisions: [],
      createdAt: Date.now(),
    }
    save("game", gameState)
    nav("/play")
  }

  const onPlayerCountChange = (count: number) => {
    setPlayerCount(count)
    setPlayers(
      Array.from({ length: count }, (_, i) => players[i] || { id: i + 1, name: "" })
    )
  }

  return (
    <div className="setup-container">
      <header className="setup-header">
        <h1>Configurar partida</h1>
        <p>Define jugadores y roles antes de empezar</p>
      </header>

      <div className="setup-card">
        <div className="setup-field">
            <NumberStepper
              label="Número de jugadores"
              value={playerCount}
              setValue={(count) => onPlayerCountChange(count)}
              min={4}
              max={63}
            />
          </div>

        <div className="setup-field">
          <NumberStepper
            label="Cantidad de lobos"
            value={loboCount}
            setValue={(count) =>
              setLoboCount(Math.max(1, Math.min(count, Math.floor(playerCount / 2) - 1)))
            }
            min={1}
            max={Math.floor(playerCount / 2) - 1}
          />
        </div>

        <div className="setup-field">
          <label>Roles en juego (excepto lobos)</label>
          <div className="roles-list">
            {DEFAULT_ROLES.filter(r => r.key !== "lobo").map(r => (
              <label
                key={r.key}
                className={`role-chip ${
                  rolesInGame.includes(r.key) ? "active" : ""
                }`}
                onClick={() => toggleRole(r.key)}
              >
                {r.name}
              </label>
            ))}
          </div>
        </div>

        <div className="setup-field">
          <h3>Introduce los nombres de los jugadores</h3>
          <div className="players-list">
            {players.map(p => (
              <input
                key={p.id}
                type="text"
                placeholder={`Jugador ${p.id}`}
                value={p.name}
                onChange={e => updatePlayerName(p.id, e.target.value)}
              />
            ))}
          </div>
        </div>

        <button className="start-btn" onClick={startGame}>
          🚀 Empezar partida
        </button>
      </div>
    </div>
  )
}
