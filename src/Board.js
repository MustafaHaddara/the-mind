import React from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const DropTypes = {
  CARD: 'CARD'
}

const DropZone = props => {
  const [, drop] = useDrop({
    accept: DropTypes.CARD,
    drop: (item, monitor) => {
      console.log('dropped on board')
      props.onDrop()
      props.moves.addCardPosition({
        ...monitor.getClientOffset(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset
      })
    }
  })
  console.log(props.cardsPlayed)

  return (
    <div style={{ textAlign: 'center' }}>
      Cards played:
      <div
        ref={drop}
        style={{
          backgroundColor: 'lightgrey',
          width: '100%',
          height: '400px',
          display: 'block'
        }}
      >
        {props.cardsPlayed.length > 0
          ? props.cardsPlayed.map((card, i) => (
              <div
                key={card}
                style={{
                  color: 'black',
                  background: 'aliceblue',
                  fontSize: '24pt',
                  width: '80px',
                  height: '36px',
                  border: '1px solid #000',
                  textAlign: 'center',
                  position: 'absolute',
                  top: props.cardPositions[i]
                    ? `${((props.cardPositions[i].y +
                        props.cardPositions[i].scrollY) /
                        (props.cardPositions[i].screenHeight +
                          props.cardPositions[i].scrollY +
                          38)) *
                        100}%`
                    : 'auto',
                  left: props.cardPositions[i]
                    ? `${((props.cardPositions[i].x +
                        props.cardPositions[i].scrollX) /
                        (props.cardPositions[i].screenWidth +
                          props.cardPositions[i].scrollX +
                          82)) *
                        100}%`
                    : 'auto'
                }}
              >
                {card}
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

const Card = props => {
  const [, drag] = useDrag({
    item: { type: DropTypes.CARD },
    begin: monitor => props.onStart(),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        props.onCancel()
      }
    }
  })

  return (
    <div
      ref={drag}
      style={{
        outline: 'black solid 1px',
        background: 'aliceblue',
        width: '80px',
        textAlign: 'center'
      }}
    >
      {props.val}
    </div>
  )
}

const Hand = props => {
  return (
    <div style={{ minHeight: '40px' }}>
      Your cards:
      <div
        style={{
          // outline: 'red 1px dashed',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly'
        }}
      >
        {props.cards.map(card => (
          <Card
            key={card}
            val={card}
            onStart={props.onStart}
            onCancel={props.onCancel}
          />
        ))}
      </div>
    </div>
  )
}

const PlayerList = props => {
  return (
    <div>
      {props.allPlayers.map(({ id: playerId, name }) => {
        // props.currentPlayerId is a string, pId is a number
        // == used intentionally here!
        // eslint-disable-next-line
        if (playerId == props.currentPlayerId) {
          return null
        }
        return (
          <div
            key={playerId}
            style={{ color: props.aboutToPlay[playerId] ? 'red' : 'black' }}
          >
            {name} ({props.players[playerId].cards.length}{' '}
            {props.players[playerId].cards.length === 1 ? 'card' : 'cards'}{' '}
            remaining)
          </div>
        )
      })}
    </div>
  )
}

export const Board = props => {
  console.log(props)
  console.log(props.G.players[props.playerID].cards)
  if (props.G.gameOver) {
    return (
      <div>
        <div>{props.G.gameOver}</div>
        <button onClick={() => props.moves.resetGame()}>Restart</button>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <PlayerList
          allPlayers={props.matchData}
          players={props.G.players}
          currentPlayerId={props.playerID}
          aboutToPlay={props.G.aboutToPlay}
        />
        <DropZone
          cardsPlayed={props.G.cardsPlayed}
          cardPositions={props.G.cardPositions}
          moves={props.moves}
          onDrop={() => props.moves.playCard(0)}
        />
        <Hand
          cards={props.G.players[props.playerID].cards}
          onStart={() => props.moves.aboutToPlay()}
          onCancel={() => props.moves.cancelPlay()}
        />
      </div>
    </DndProvider>
  )
}
