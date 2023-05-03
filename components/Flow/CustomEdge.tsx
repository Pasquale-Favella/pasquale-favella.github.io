import { memo, FC ,MouseEvent} from 'react';
import useFlow from '@/hooks/use-flow';
import { EdgeProps, getBezierPath } from 'reactflow';
import { MdRemoveRoad } from 'react-icons/md';

const foreignObjectSizeX = 80;
const foreignObjectSizeY = 50;

type EdgeCustomProps = {}
 
const CustomEdge : FC<EdgeProps<EdgeCustomProps>> = ({
    id ,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    markerEnd,
    style
})=> {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { deleteEdgeById } = useFlow();

  const onEdgeClick = (event : MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id : string) => {
    event.stopPropagation();
    deleteEdgeById(id);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSizeY}
        height={foreignObjectSizeX}
        x={labelX - foreignObjectSizeX / 2}
        y={labelY - foreignObjectSizeY / 2}
        className="flex justify-center items-center"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >

        <div className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]" data-tip="remove">
          <button className="btn btn-ghost btn-circle normal-case btn-sm text-error" onClick={(event) => onEdgeClick(event, id)}>
            <MdRemoveRoad/>
          </button>
        </div>
      </foreignObject>
    </>
  );
}

export default memo(CustomEdge);
