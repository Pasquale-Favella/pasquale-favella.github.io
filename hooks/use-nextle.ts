import { useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentGuessAtom, currentGuessWordAtom, guessesAtom, hasLostNextleAtom, hasWonNextleAtom, wordAtom, wordsAtom } from "@/store/nextle.atom";
import { NextleUtils } from "@/utils";

export default function useNextle() {

    const words = useAtomValue(wordsAtom)
    const [word , setWord] = useAtom(wordAtom);
    const [guesses , setGuesses] = useAtom(guessesAtom);
    const [currentGuessNumber , setCurrentTry ] = useAtom(currentGuessAtom);
    const hasWon = useAtomValue(hasWonNextleAtom);
    const hasLost = useAtomValue(hasLostNextleAtom);
    const dispatch = useSetAtom(currentGuessWordAtom);

    const allGuesses = useMemo(() => guesses.slice(0, currentGuessNumber).join('').split('') , [guesses , currentGuessNumber]);

    const exactGuesses = useMemo(() => {
        return (
            word
              .split('')
              .filter((letter, i) => {
                return guesses
                  .slice(0, currentGuessNumber)
                  .map((word) => word[i])
                  .includes(letter)
              })
          )
    }, [guesses , currentGuessNumber]);

    const inexactGuesses = useMemo(() => word.split('').filter((letter) => allGuesses.includes(letter)) , [allGuesses]);

    const handleAction = ({ key }: KeyboardEvent | { key: string }) => {
        
        if(key === 'Enter') return dispatch({ type: key });

        if(key === 'Backspace' || key === '⟵') return dispatch({ type: key });

        if(key.match(/^[A-z]$/)) return dispatch({ type: 'Add', value: key });
        
    }

    const restart = ()=> {
        const {currentGuess , guesses , word} = NextleUtils.initializeGameState(words)
        setWord(word)
        setGuesses(guesses)
        setCurrentTry(currentGuess)
    };

    return {
        word,
        guesses,
        currentGuessNumber,
        hasWon,
        hasLost ,
        handleAction ,
        exactGuesses ,
        inexactGuesses ,
        allGuesses ,
        restart
    }
}