import { memo, FC, CSSProperties } from 'react';
import { useTheme } from '@/hooks/use-theme';
import useFlow from '@/hooks/use-flow';
import { useAtom } from 'jotai';
import { Handle, Position, NodeProps } from 'reactflow';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BiDotsVerticalRounded, BiMove } from 'react-icons/bi';
import { CustomNodeData } from '@/store/flow.atom';
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import('../RichEditor'), {
  ssr: false,
});

const sourceHandleStyleA: CSSProperties = { 
  left: 15 ,
  backgroundColor : 'hsl(var(--p))'
};
const sourceHandleStyleB: CSSProperties = {
  right: 15,
  left: 'auto',
  backgroundColor : 'hsl(var(--p))'
};


const CustomNode: FC<NodeProps<CustomNodeData>> = ({ id }) => {

  const { deleteNodeById , getNodeIdAtom } = useFlow();
  const nodeIdAtom = getNodeIdAtom(id);
  const [node, updateNode] = useAtom(nodeIdAtom);
  const { isDarkMode } = useTheme();

  const handleChange = (value : Partial<CustomNodeData>)=> updateNode(value);
  const handleRemove = ()=> deleteNodeById(id);


  return (
    <>
      <Handle type="target" id={`${id}-top`} position={Position.Top} />
 
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
            <input name='title' type="text" placeholder="Flow title" className="input input-ghost w-full max-w-xs" 
              value={node?.data.title ?? ''}
              onChange={e => handleChange({ title : e.target.value})}
            />
          </h2>

          <RichEditor 
            placeholder="Type here to begin your flow..."
            initialData={node?.data.body}  
            onEditorChange={(outputData)=> handleChange({body : outputData})} 
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-d`}
        style={sourceHandleStyleA}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-e`}
        style={sourceHandleStyleB}
      />
    </>
  );
};

export default memo(CustomNode);