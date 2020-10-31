## The Mind!

JS implementation of The Mind with networking!

To test locally, change the `server` definition in `App.js`.

Run `npm run start` to start the front end and `npm run serve` to start the back end.

## Todo:

- make it playable with more than 1 card per person
- better feedback for when one player is about to play (make their name shake? make it big? idk)

## Sample State:

```
const G = {
    players: {
        1: {
            cards: [67]
        },
        2: {
            cards: [45, 99]
        }
    },
    aboutToPlay: {
        1: null
    },
    cardsPlayed: [ 20 ],
    gameOver: "you win!",
}
```
