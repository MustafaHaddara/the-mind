import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const DropTypes = {
    CARD: 'CARD'
};

const DropZone = props => {
    const [, drop] = useDrop({
        accept: DropTypes.CARD,
        drop: () => { console.log("dropped on board"); props.onDrop(); }
    });
    console.log(props.cardsPlayed)
    
    return (
        <div style={{textAlign: "center"}}>
            Last card played:
            <div
                ref={drop}
                style={{
                    backgroundColor: 'lightgrey',
                    width: '100%',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {props.cardsPlayed.length > 0 ?
                    <div 
                        style={{
                            color: 'black',
                            fontSize: '24pt',
                            width: '25%',
                            height: '25%',
                            textAlign: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        {props.cardsPlayed[props.cardsPlayed.length-1]}
                    </div>
                    :
                    null
                }
            </div>
        </div>
    );
};

const Card = props => {
    const [, drag] = useDrag({
        item: { type: DropTypes.CARD },
        begin: (monitor) => props.onStart(),
        end: (item, monitor) => {
            if (!monitor.didDrop()) {
                props.onCancel()
            }
        }
    });

    return <div 
        ref={drag}
        style={{
            outline: 'black solid 1px',
            background: 'aliceblue',
            width: '80px',
            textAlign: 'center'
        }}
    >
        {props.val}
    </div>;
};

const Hand = props => {
    return (
        <div>
            Your cards:
            <div
                style={{
                    // outline: 'red 1px dashed',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                }}
            >
                {props.cards.map(card => (<Card key={card} val={card} onStart={props.onStart} onCancel={props.onCancel}/>))}
            </div>
        </div>
    );
};

const PlayerList = (props) => {
    return <div>
        {props.allPlayers.map(({ id: playerId, name }) => {
            // props.currentPlayerId is a string, pId is a number
            // == used intentionally here!
            // eslint-disable-next-line
            if (playerId == props.currentPlayerId) {
                return null;
            }
            return <div key={playerId} style={{color: props.aboutToPlay[playerId] ? 'red' : 'black'}}>{name}</div>;
        })}
    </div>;
}

export const Board = props => {
    console.log(props);
    console.log(props.G.players[props.playerID].cards);
    if (props.G.gameOver) {
        return (
            <div>
                <div>{props.G.gameOver}</div>
                <button onClick={() => props.moves.resetGame()}>Restart</button>
            </div>
        );
    }

    return (
    <DndProvider backend={HTML5Backend}>
        <div>
            <PlayerList
                allPlayers={props.matchData}
                currentPlayerId={props.playerID}
                aboutToPlay={props.G.aboutToPlay}
            />

            <DropZone 
                cardsPlayed={props.G.cardsPlayed}
                onDrop={() => props.moves.playCard(0)}
            />
            <Hand 
                cards={props.G.players[props.playerID].cards}
                onStart={() => props.moves.aboutToPlay()}
                onCancel={() => props.moves.cancelPlay()}
            />
        </div>
    </DndProvider>
)};