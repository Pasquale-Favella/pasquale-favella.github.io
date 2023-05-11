
import { FC, memo } from "react"
import clsx from "clsx"
import useNextle from "@/hooks/use-nextle"
import { Utils } from "@/utils"

type GuessProps = { 
  index : number
}
 
const Guess : FC< GuessProps> = ({index})=> {

  const { word , guesses , currentGuessNumber , allGuesses } = useNextle();

  const guess = guesses[index];
  const isGuessed = index < currentGuessNumber;

  return (
    <div className="grid grid-cols-5 gap-1 md:gap-2">
      {new Array(5).fill(0).map((_, i) => {

        return (
          <div key={Utils.uid()}
            className={clsx(
              'flex w-14 h-14 md:h-16 md:w-16 items-center justify-center rounded border border-base-300 font-bold uppercase',
              !isGuessed 
                ? 'bg-base-100' 
                : guess[i] === word[i] 
                ? 'bg-primary bg-opacity-50' 
                : word.includes(guess[i]) 
                ? 'bg-warning bg-opacity-50' 
                : allGuesses.includes(guess[i])
                ? 'bg-base-300'
                : 'bg-base-100',
            )}
          >
            {guess[i]}
          </div>
        )
      })}
    </div>
  )
}

export default memo(Guess);