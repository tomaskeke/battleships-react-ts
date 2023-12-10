import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GameProvider } from './contexts/gameContext.tsx';
import { Game } from './views/Game.tsx';
import './App.css'
import Lobby from "./views/Lobby.tsx";
import PlaceShips from "./views/PlaceShips.tsx";
import { UserProvider } from "./contexts/userContext.tsx";
import { useEffect } from "react";
import { Layout } from "./components/Layout.tsx";


function App() {
    useEffect(() => {
        const handleTabClose = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave?'
            localStorage.removeItem('players')
        }
        window.addEventListener('beforeunload', handleTabClose)
        return () => {
            window.removeEventListener('beforeunload', handleTabClose)
        }
    })

    const router = createBrowserRouter([
        {
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Lobby />
                },
                {
                    path: '/place-ships',
                    element: <PlaceShips />
                },
                {
                    path: '/game',
                    element: <Game />
                }
            ]
        }
        ])
  return (

          <GameProvider>
              <UserProvider>
                  <RouterProvider router={router} />
              </UserProvider>
          </GameProvider>



  );
}

export default App;
