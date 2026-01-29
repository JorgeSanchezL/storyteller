import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Setup from './routes/Setup.tsx'
import Play from './routes/Play.tsx'
import Summary from './routes/Summary.tsx'
import GameOver from './routes/GameOver.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Setup /> },
  { path: '/play', element: <Play /> },
  { path: '/summary', element: <Summary /> },
  { path: '/gameover', element: <GameOver /> },
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
