
import { FC, memo } from "react"
import clsx from "clsx"
import useNextle from "@/hooks/use-nextle"
import useIsMobile from "@/hooks/use-isMobile"
import { Utils } from "@/utils"

type GuessProps = { 
  index : number
}
 
const Guess : FC< GuessProps> = ({index})=> {

  const { word , guesses , currentGuessNumber } = useNextle();
  const isMobile = useIsMobile();

  const guess = guesses[index];
  const isGuessed = index < currentGuessNumber;

  return (
    <div className="mb-2 grid grid-cols-5 gap-2">
      {new Array(5).fill(0).map((_, i) => {

        return (
          <div key={Utils.uid()}
            className={clsx(
              'flex h-16 w-16 items-center justify-center rounded border border-base-300 font-bold uppercase',
              !isGuessed ? 'bg-base-100' : guess[i] === word[i] ? 'bg-primary bg-opacity-50' : word.includes(guess[i]) ? 'bg-warning bg-opacity-50' : 'bg-base-100' ,
              isMobile ? 'scale-90' : ''
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