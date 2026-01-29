import { useNavigate } from "react-router-dom"
import { load } from "../lib/storage"
import { GameState } from "../lib/types/game"

import "../styles/colors.css"
import "../styles/gameover.css"

export default function GameOver() {
  const nav = useNavigate()
  const game = load<GameState | null>("game", null)

  if (!game || !game.winner) {
    return (
      <div className="gameover-container">
        <p>Error: no hay partida finalizada.</p>
        <button onClick={() => nav("/")} className="gameover-button">
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="gameover-container">
      <h1>🏆 Fin de la partida</h1>
      {game.winner === "aldeanos" ? (
        <p>¡Los <b>aldeanos</b> han ganado eliminando a todos los lobos!</p>
      ) : (
        <p>¡Los <b>lobos</b> han ganado dominando la aldea!</p>
      )}

      <button onClick={() => nav("/")} className="gameover-button">
        Volver al inicio
      </button>
    </div>
  )
}
