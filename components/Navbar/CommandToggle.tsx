import { useKBar } from 'kbar';
import { FiCommand } from 'react-icons/fi';



const CommandToggle = ()=>{

    const { query } = useKBar();
    
    return(
        <div className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]" data-tip="commands">
            <button className="btn btn-ghost btn-circle btn-sm"
              onClick={() => query.toggle()}
            >
              <FiCommand size={20} />
            </button>
        </div>
    )
}

export default CommandToggle