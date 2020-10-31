import React, { useState } from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import { Board } from './Board'
import { TheMind } from './Game'
import { Lobby } from 'boardgame.io/react'

// const MindClient = Client({
//   game: TheMind,
//   board: Board,
//   multiplayer: SocketIO({ server: 'localhost:8000' }),
//   // multiplayer: Local(),
//   // numPlayers: 4
// });

// const NameChooser = props => {
//   const [value, setValue] = useState('');
//   return (
//     <div>
//       Please enter your name:
//       <input type="text" placeholder="your name" value={value} onChange={evt => setValue(evt.target.value)}/>
//       <button onClick={() => props.setName(value)}>submit</button>
//     </div>
//   )
// }

const server = `https://${window.location.hostname}`
// development mode
// const server = http://${window.location.hostname}:8000

const App = () => {
  return (
    <div>
      <Lobby
        gameServer={server}
        lobbyServer={server}
        gameComponents={[{ game: TheMind, board: Board }]}
        // debug={true}
      />
      ;
    </div>
  )
}
export default App
