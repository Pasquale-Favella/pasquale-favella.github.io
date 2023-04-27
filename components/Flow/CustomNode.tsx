import { memo, FC, CSSProperties , useState, ChangeEvent} from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Handle, Position, NodeProps } from 'reactflow';
import { useFlow } from './FlowContext';
import { BiDotsVerticalRounded } from 'react-icons/bi';

const sourceHandleStyleA: CSSProperties = { left: 15 };
const sourceHandleStyleB: CSSProperties = {
  right: 15,
  left: 'auto',
};

type CustomNodeData = {
  title : string,
  body : string
}

const CustomNode: FC<NodeProps<CustomNodeData>> = ({ data, xPos, yPos , id }) => {

  const [{title , body} , setNodeData] = useState(data);
  const [image , setImage] = useState<string | null >(null);
  const [showImage , setShowImage] = useState<boolean>(false);
  const { deleteNodeById } = useFlow()

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=> setNodeData(prevData=> ({
    ...prevData,
    [event.target.name] : event.target.value
  }));

  const handleRemove = ()=> deleteNodeById(id);

  const onImageChange = (event : ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(URL.createObjectURL(img));
    }
  };

  return (
    <>
      
      <Handle type="target" position={Position.Top} />
 
      <div className="card w-96 bg-base-300 shadow-xl relative">

        <div className="dropdown dropdown-end absolute top-2 right-1">
          <label tabIndex={0} className="btn btn-ghost btn-circle normal-case btn-sm">
            <BiDotsVerticalRounded />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a className="flex justify-start items-center">
                <label className="label justify-start gap-2 cursor-pointer w-full">
                  <input type="checkbox" className="checkbox checkbox-xs" checked={showImage} onChange={()=>setShowImage(prev=>!prev)}/>
                  <span className="label-text text-xs">Add image</span> 
                </label>
              </a>
            </li>

            <li>
              <a className="flex justify-start items-center">
                <button className="label justify-start gap-2 cursor-pointer w-full" onClick={handleRemove}>
                  <RiDeleteBinLine/>
                  <span className="label-text text-xs">Delete flow</span> 
                </button>
              </a>
            </li>

          </ul>
        </div>

        <div className="card-body">
          <h2 className="card-title">
            <input name='title' type="text" placeholder="Thought" className="input input-ghost w-full max-w-xs" 
              value={title}
              onChange={handleChange}
            />
          </h2>

          <textarea name='body' className="textarea textarea-ghost" placeholder="add a note"
           value={body}
           onChange={handleChange}
          ></textarea>

          {showImage && <input type="file" accept="image/*" className="file-input file-input-ghost file-input-xs  max-w-xs" onChange={onImageChange} placeholder='image to preview'/>}
          {showImage && image && <figure><img src={image} alt="Flow Image" /></figure>}
          
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={sourceHandleStyleA}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={sourceHandleStyleB}
      />
    </>
  );
};

export default memo(CustomNode);