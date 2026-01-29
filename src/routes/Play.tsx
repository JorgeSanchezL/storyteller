import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { load, save } from "../lib/storage"
import { Game, GameState } from "../lib/types/game"
import { DEFAULT_ROLES, type Role } from "../lib/types/role"
import { Player } from "../lib/types/player"
import { RolesFactory } from "../game/roles/RolesFactory"
import Assign from "../game/modals/Assign"

import "../styles/colors.css"
import "../styles/play.css"
import "../styles/modal.css"

export default function Play() {
  const nav = useNavigate()
  const [game, setGame] = useState<Game | null>(null)
  const [currentAssignRole, setCurrentAssignRole] = useState<Role | null>(null)
  const [currentActionRole, setCurrentActionRole] = useState<Role | null>(null)
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])

  useEffect(() => {
    const loaded = load<GameState | null>("game", null)
    if (loaded) setGame(new Game(loaded))
  }, [])

  const activeRoles = useMemo(() => {
    if (!game) return []
    const uniqueRoles = Array.from(new Set(game.rolesInGame))
    return DEFAULT_ROLES
      .filter(r => uniqueRoles.includes(r.key))
      .sort((a, b) => a.order - b.order)
  }, [game])

  const availablePlayers = useMemo<Player[]>(() => {
    if (!game || !currentAssignRole) return []
    const assignedIds = Object.values(game.assignments)
      .flatMap(v => (Array.isArray(v) ? v : [v]))
    return game.players.filter(p => !assignedIds.includes(p.id))
  }, [game, currentAssignRole])

  const assignAndMark = () => {
    if (!game || !currentAssignRole) return
    const requiredCount = game?.rolesInGame.filter(r => r === currentAssignRole.key).length
    if (selectedPlayers.length !== requiredCount) return

    const updated = new Game(game)
    updated.assignments[currentAssignRole.key] =
      requiredCount === 1 ? selectedPlayers[0] : [...selectedPlayers]

    updated.decisions = updated.decisions.filter(
      d => !(d.role === currentAssignRole.key && d.round === updated.round)
    )
    updated.decisions.push({
      role: currentAssignRole.key,
      round: updated.round,
      payload: { assigned: selectedPlayers },
      at: Date.now(),
    })

    save("game", updated)
    setGame(updated)
    setSelectedPlayers([])
    setCurrentAssignRole(null)
  }

  const handleActionConfirm = (payload: Record<string, unknown>) => {
    if (!game || !currentActionRole) return
    const updated = new Game(game)
    updated.decisions = updated.decisions.filter(
      d => !(d.role === currentActionRole.key && d.round === updated.round)
    )
    updated.decisions.push({
      role: currentActionRole.key,
      round: updated.round,
      payload,
      at: Date.now()
    })
    save("game", updated)
    setGame(updated)
    setCurrentActionRole(null)
  }

  const finishRound = () => {
    if (!game) return
    save("game", game)
    nav("/summary")
  }

  if (!game) {
    return (
      <div className="play-container">
        <p>No hay partida cargada.</p>
        <button onClick={() => nav("/")}>Volver</button>
      </div>
    )
  }

  return (
    <div className="play-container">
      <div className="play-header">
        <h2>Ronda {game.round}</h2>
      </div>

      <div className="play-roles">
        {activeRoles.map(roleDef => {
          const assigned = game.assignments[roleDef.key]
          const assignedIds = Array.isArray(assigned)
            ? assigned
            : assigned !== undefined
              ? [assigned]
              : []

          const role = RolesFactory.createRole(
            roleDef.key,
            game.players,
            assignedIds,
            game.powers
          )

          return role.render(
            () => setCurrentAssignRole(role),
            () => setCurrentActionRole(role)
          )
        })}
      </div>

      <button onClick={finishRound} className="finish-round">
        Finalizar ronda
      </button>

      {currentAssignRole && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Assign
              roleLabel={currentAssignRole.key}
              requiredCount={game.rolesInGame.filter(r => r === currentAssignRole.key).length}
              availablePlayers={availablePlayers}
              selectedPlayers={selectedPlayers}
              setSelectedPlayers={setSelectedPlayers}
              onConfirm={assignAndMark}
              onCancel={() => {
                setCurrentAssignRole(null)
                setSelectedPlayers([])
              }}
            />
          </div>
        </div>
      )}

      {currentActionRole && (
        <div className="modal-overlay">
          <div className="modal-content">
            {currentActionRole.renderActionModal(
              handleActionConfirm,
              () => setCurrentActionRole(null),
              game.players
            )}
          </div>
        </div>
      )}
    </div>
  )
}
