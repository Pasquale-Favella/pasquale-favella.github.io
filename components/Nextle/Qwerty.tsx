import { FC, memo , useEffect} from "react"
import clsx from "clsx";
import { QWERTY } from "@/config/constants";
import useNextle from "@/hooks/use-nextle";
import { Utils } from "@/utils";

type QwertyProps = {}
 
const Qwerty : FC<QwertyProps> = ()=> {

  const { handleAction , exactGuesses , inexactGuesses , allGuesses } = useNextle();

  useEffect(() => {

    window.addEventListener('keyup', handleAction)

    return () => {
      window.removeEventListener('keyup', handleAction)
    }
  }, [handleAction]);

  return (
    <div className="w-full flex flex-col justify-center items-center mx-1">
      {QWERTY.map((row,i) => (
        <div key={Utils.uid()} 
          className='flex justify-center w-full gap-px md:gap-1 my-px md:my-1'
        >
          {(i===2 ? ['Enter',...row.split(''),'⟵'] : row.split('')).map((char) => {

            return (
              <button
                key={Utils.uid()}
                onClick={()=>handleAction({key : char})}
                className={clsx(
                  'kbd font-semibold tracking-wider md:tracking-wide h-12 w-12',
                  exactGuesses.has(char) 
                    ? 'bg-primary bg-opacity-25' 
                    : inexactGuesses.has(char) 
                    ? 'bg-warning bg-opacity-25' 
                    : allGuesses.has(char)
                    ? 'bg-base-300'
                    : 'bg-base-100',
                  char === 'Enter' && 'min-w-min'
                )}
              >
                {char}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default memo(Qwerty);
