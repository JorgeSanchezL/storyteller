import { useNavigate } from "react-router-dom"
import { summarizeRound } from "../lib/narrator"
import { Game } from "../lib/types/game"
import { load, save } from "../lib/storage"

import "../styles/colors.css"
import "../styles/summary.css"

export default function Summary() {
  const nav = useNavigate()
  const game = load<Game | null>("game", null)
  if (!game) {
    return <p>No hay partida en curso</p>
  }

  const roundDecisions = game.decisions.filter(d => d.round === game.round)
  const logs = summarizeRound(roundDecisions, game.players)

  const handleContinue = () => {
    const g = new Game(game)
    g.processCurrentRound()
    g.round += 1
    save("game", g)
    if (g.winner !== null) {
      nav("/gameover")
    } else {
      nav("/play")
    }
  }

  return (
    <div className="summary-container">
      <h2>Resumen de la ronda {game.round}</h2>
      <div className="summary-content">
        <div className="summary-list-wrapper">
          <ul className="summary-list">
            {logs.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleContinue}
          className="summary-button"
        >
          Continuar a la ronda {game.round + 1}
        </button>
      </div>
    </div>
  )
}
