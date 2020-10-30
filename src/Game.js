import { ActivePlayers } from 'boardgame.io/core';
// import { PluginPlayer } from 'boardgame.io/plugins';

// G
/*
{
    playerCards: {
        playerId: [],
        playerId: [],
    },
    cardsPlayed: [],
    aboutToPlay: {
        playerId: timestamp
    }
}
*/

const shuffleDeck = (shuffle) => {
    let deck = []
    for (let i = 1; i <= 100; i++) {
        deck.push(i);
    }
    return shuffle(deck);
}

export const isLosingMove = (cardJustPlayed, players) => {
    const other = Object.keys(players).find(playerId => {
        const cards = players[playerId].cards;
        return cards.find(c => c < cardJustPlayed);
    });
    return !!other;
}

export const isWinningMove = (players) => {
    const remaining = Object.keys(players).find(playerId => {
        const cards = players[playerId].cards;
        return cards.length > 0;
    });
    return !remaining;
}

export const isGameOver = (G) => {
    console.log("checking endgame");
    if (G.cardsPlayed.length === 0) {
        console.log("init");
        return;
    }
    if (isLosingMove(G.cardsPlayed[G.cardsPlayed.length - 1], G.players)) {
        console.log("lost");
        return 'Game Over!';
    } else if (isWinningMove(G.players)) {
        console.log("win");
        return 'You win!';
    }
    console.log("continue");
}

const setupGame = (ctx) => {
    const d = shuffleDeck(d => ctx.random.Shuffle(d));
    const gameState = {
        players: {},
        aboutToPlay: {},
        cardsPlayed: [],
        cardPositions: [],
        gameOver: false,
    };
    for (let i = 0; i < ctx.numPlayers; i++) {
        gameState.players[i] = { cards: [d[i]] };
    }
    return gameState;
}

// moves
export const playCard = (G, ctx, card) => {
    console.log(`${ctx.playerID} played`);
    const playerId = ctx.playerID;
    const playedCard = G.players[playerId].cards[card];
    const newG = {
        ...G,
        players: {
            ...G.players,
            [playerId]: {
                cards: G.players[playerId].cards.filter(c => c !== playedCard)
            }
        },
        aboutToPlay: {
            ...G.aboutToPlay,
            [playerId]: null
        },
        cardsPlayed: [...G.cardsPlayed, playedCard],
    }
    newG.gameOver = isGameOver(newG);
    return newG;
};

const addCardPosition = (G, ctx, cardPosition) => {
    return {
        ...G,
        cardPositions: [...G.cardPositions, cardPosition]
    }
}

export const aboutToPlay = (G, ctx) => {
    return {
        ...G,
        aboutToPlay: {
            ...G.aboutToPlay,
            [ctx.playerID]: Date.now()
        }
    }
};

export const cancelPlay = (G, ctx) => {
    return {
        ...G,
        aboutToPlay: {
            ...G.aboutToPlay,
            [ctx.playerID]: null
        }
    }
};

export const resetGame = (G, ctx) => {
    return setupGame(ctx);
}

export const TheMind = {
    name: 'the-mind',

    setup: (ctx) => setupGame(ctx),

    moves: {
        aboutToPlay,
        cancelPlay,
        playCard,
        addCardPosition,
        resetGame,
    },

    // endIf: (G) => isGameOver(G),

    turn: {
        activePlayers: ActivePlayers.ALL
    },

    // phases: {
    //     // joining: {
    //     //     moves: {
    //     //         startGame: (G, ctx) => {
    //     //             ctx.events.endPhase();
    //     //         }
    //     //     },
    //     //     start: true,
    //     //     next: 'playing',
    //     // },
    //     playing: {
    //         turn: {
    //             activePlayers: ActivePlayers.ALL
    //         }
    //     },
    //     aboutToPlay: {},
    // },

    minPlayers: 2,
    maxPlayers: 20,

    // plugins: [ PluginPlayer({ playerSetup: (id) => ({ cards: [], aboutToPlay: null }) })]
}