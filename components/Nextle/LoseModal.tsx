import useNextle from "@/hooks/use-nextle"
import { HiPlay } from "react-icons/hi"


const LoseModal = ()=>{

    const { hasLost , restart , word } = useNextle()
    
    return(
        <>
            <input type="checkbox" className="modal-toggle" defaultChecked={hasLost}/>
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Oh No!</h3>
                    <p className="py-4">The Nextle word was <b>{word}</b></p>
      
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

export default LoseModal