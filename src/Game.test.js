import {
  isLosingMove,
  isWinningMove,
  isGameOver,
  playCard,
  aboutToPlay,
  cancelPlay,
  resetGame
} from './Game'

describe('Game unit tests', () => {
  it("player 1's move should lose the game", () => {
    const cardJustPlayed = 20
    const players = {
      1: {
        cards: [10, 35]
      }
    }
    expect(isLosingMove(cardJustPlayed, players)).toBe(true)
  })

  it('is not a losing move played by player 1', () => {
    const cardJustPlayed = 5
    const players = {
      1: {
        cards: [10, 35]
      }
    }
    expect(isLosingMove(cardJustPlayed, players)).toBe(false)
  })

  it('is not a losing move played by player 1 edge case', () => {
    const cardJustPlayed = 9
    const players = {
      1: {
        cards: [10, 35]
      },
      2: {
        cards: [11, 12]
      }
    }
    expect(isLosingMove(cardJustPlayed, players)).toBe(false)
  })

  it('player 1 can win if no cards left', () => {
    const players = { 1: { cards: [] } }

    expect(isWinningMove(players)).toBe(true)
  })

  it('Player 1 can play winning move', () => {
    const ctx = {
      turn: 4,
      currentPlayer: '1',
      numPlayers: 2,
      playerID: 1
    }
    const G = {
      players: {
        1: { cards: [15] }
      },
      cardsPlayed: [3]
    }

    const newG = playCard(G, ctx, 0)
    expect(newG.gameOver).toBe('You win!')
  })

  it('game should not be over, should be init', () => {
    const cardsPlayed = []

    expect(isGameOver({ cardsPlayed })).toBeUndefined()
  })

  it('game should be over - player won the game', () => {
    const G = {
      players: {
        1: { cards: [] }
      },
      cardsPlayed: [3]
    }
    expect(isGameOver(G)).toBe('You win!')
  })

  it('game should be over - player lost the game', () => {
    const G = {
      players: {
        1: { cards: [5] }
      },
      cardsPlayed: [3, 10, 20, 53]
    }

    expect(isGameOver(G)).toBe('Game Over!')
  })

  it('Player 1 can play a card', () => {
    const ctx = {
      turn: 2,
      currentPlayer: '1',
      numPlayers: 2,
      playerID: 1
    }

    const G = {
      players: {
        1: { cards: [15] }
      },
      aboutToPlay: {
        1: null
      },
      cardsPlayed: [3]
    }

    const newG = playCard(G, ctx, G.players[1].cards[0])
    expect(newG).toBeDefined()
  })

  it('player 1 about to play', () => {
    const ctx = {
      turn: 2,
      currentPlayer: '1',
      numPlayers: 2,
      playerID: 1
    }
    const G = {
      players: {
        1: { cards: [15] }
      },
      cardsPlayed: [3]
    }
    expect(aboutToPlay(G, ctx)).toBeDefined()
  })

  it('cancel play', () => {
    const ctx = {
      turn: 2,
      currentPlayer: '1',
      numPlayers: 2,
      playerID: 1
    }
    const G = {
      players: {
        1: { cards: [15] }
      },
      cardsPlayed: [3]
    }
    expect(cancelPlay(G, ctx)).toBeDefined()
  })

  it('can reset game', () => {
    //ctx object for testing purposes
    const ctx = {
      turn: 2,
      currentPlayer: '1',
      numPlayers: 2,
      playerID: 1,
      random: {
        Shuffle (d) {
          return d
        }
      }
    }
    const G = {
      players: {
        1: { cards: [15] }
      },
      cardsPlayed: [3]
    }
    const newGame = resetGame(G, ctx)

    expect(Object.keys(newGame.players)).toHaveLength(2)
    expect(newGame.players[0].cards).toHaveLength(1)
    expect(newGame.aboutToPlay).toStrictEqual({})
    expect(newGame.gameOver).toBe(false)
  })
})
