import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

export type NextleGameState = {
  word: string;
  guesses: string[];
  currentGuess: number;
}

type GuessActionTypes = 'Enter'|'Backspace'|'⟵'|'Add'

type GuessAction = {
    type : GuessActionTypes;
    value ?: string;
}

export const wordsAtom = atom<string[]>([]);

const wordsSetAtom = atom(get => new Set(get(wordsAtom)));

export const nextleGameStateAtom= atom<NextleGameState>({
    word: '',
    guesses: [] ,
    currentGuess: 0
});

export const wordAtom = focusAtom(nextleGameStateAtom, (optic) => optic.prop('word'));
export const guessesAtom = focusAtom(nextleGameStateAtom, (optic) => optic.prop('guesses'));
export const currentGuessAtom = focusAtom(nextleGameStateAtom, (optic) => optic.prop('currentGuess'));

export const hasWonNextleAtom = atom(
    get => {
        const currentGuessIndex = get(currentGuessAtom);
        const guesses = get(guessesAtom);
        const word = get(wordAtom);
        return guesses[currentGuessIndex - 1] === word;
    }
);

export const hasLostNextleAtom = atom(
    get => {
        const hasWon = get(hasWonNextleAtom);
        const currentGuessNumber = get(currentGuessAtom);
        return !hasWon && currentGuessNumber === 6;
    }
);

export const currentGuessWordAtom = atom(
    get => {
        const currentGuessIndex = get(currentGuessAtom);
        const guesses = get(guessesAtom);
        return guesses[currentGuessIndex];
    } ,
    (get , set , action : GuessAction)=>{

        const words = get(wordsSetAtom);
        const currentGuessIndex = get(currentGuessAtom);
        const guesses = get(guessesAtom);
        const hasWon = get(hasWonNextleAtom);
        const hasLost = get(hasLostNextleAtom);

        if(hasWon || hasLost) return;

        if(action.type === 'Enter' && words.has(guesses[currentGuessIndex])){
            set(currentGuessAtom , currentGuessIndex + 1);
        }

        if(action.type === 'Backspace' || action.type === '⟵'){
            guesses[currentGuessIndex] = guesses[currentGuessIndex].slice(0 , guesses[currentGuessIndex].length - 1);
            set(guessesAtom, [...guesses]);
        }

        if(action.type === 'Add' && action.value && guesses[currentGuessIndex].length < 5) {
            guesses[currentGuessIndex] = guesses[currentGuessIndex] + action.value.toUpperCase();
            set(guessesAtom, [...guesses]);
        }
        
    }
);

export const isCurrentWordNotInPerimeterAtom = atom(
    get => {
        const words = get(wordsSetAtom);
        const currentWord = get(currentGuessWordAtom);
        return currentWord?.length === 5 && !words.has(currentWord);
    }
);