import { useMemo } from "react"
import useNextle from "@/hooks/use-nextle"
import { HiPlay } from "react-icons/hi"
import { TbConfetti } from "react-icons/tb"
import { GiPuzzle , GiDoubleDragon} from "react-icons/gi"
import { SiGunicorn } from "react-icons/si"


const WinModal = ()=>{

    const { hasWon , restart , currentGuessNumber } = useNextle()
    
    const winningPhrase = useMemo(()=>{
        
        switch (currentGuessNumber) {
            case 1:
                return <p className="flex gap-2 justify-start items-center"><GiPuzzle size={30} /> You're a true puzzle master</p>
            case 2:
                return <p className="flex gap-2 justify-start items-center"><GiDoubleDragon size={30} /> You're a true puzzle Dragon</p>
            case 3:
                return <p className="flex gap-2 justify-start items-center"><SiGunicorn size={30} /> You're a true puzzle Unicorn</p>
        
            default:
                return <p className="flex gap-2 justify-start items-center"><TbConfetti size={30} /> Bravo! You've cracked that puzzle with ease</p>
        }
    },[currentGuessNumber])
    
    return(
        <>
            <input type="checkbox" className="modal-toggle" defaultChecked={hasWon}/>
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Great!</h3>
                    <p className="py-4">Congratulations, you've successfully solved the Nextle!</p>
                    {winningPhrase}
                    <div className="modal-action">
                        <button className="btn btn-ghost gap-2" 
                            onClick={restart}
                        >
                            <HiPlay size={24}/>
                            <span>Play again</span>
                        </button>
                    </div>
            </div>
            </div>
        </>
    )
}

export default WinModal