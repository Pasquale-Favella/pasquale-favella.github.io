import { NextleGameState } from "@/store/nextle.atom"

const initializeGameState = (words : string[]): NextleGameState => ({
    word: words[Math.floor(Math.random() * words.length)],
    guesses: new Array(6).fill('') ,
    currentGuess: 0
})

export default {
    initializeGameState
} as const