import { memo, FC, CSSProperties , useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Handle, Position, NodeProps } from 'reactflow';
import { useFlow } from './FlowContext';
import { BiDotsVerticalRounded, BiMove } from 'react-icons/bi';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '@/hooks/use-theme';

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
  const { deleteNodeById } = useFlow();
  const { isDarkMode } = useTheme();

  const handleChange = (value : Partial<CustomNodeData>)=> setNodeData(prev => ({...prev , ...value}));

  const handleRemove = ()=> deleteNodeById(id);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
        ],
        [{align: [ ]}],
        ["link", "image",'code'],
        ["clean"],
      ],
    }, 
  }), []);

  return (
    <>
      
      <Handle type="target" position={Position.Top} />
 
      <div className={`card w-96 shadow-xl relative ${isDarkMode ? "bg-base-300" : "bg-base-100"}`}>

        <div className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)] custom-drag-handle absolute top-2 left-1" data-tip="move">
            <label className="btn btn-ghost btn-circle normal-case btn-sm cursor-grab">
              <BiMove  />
            </label>
        </div>

        <div className="dropdown dropdown-end absolute top-2 right-1">
          <label tabIndex={0} className="btn btn-ghost btn-circle normal-case btn-sm">
            <BiDotsVerticalRounded />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">

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
              onChange={e => handleChange({ title : e.target.value})}
            />
          </h2>

          <ReactQuill 
            theme="snow" 
            value={body} 
            onChange={body => handleChange({body})} 
            modules={modules}
          />
          
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