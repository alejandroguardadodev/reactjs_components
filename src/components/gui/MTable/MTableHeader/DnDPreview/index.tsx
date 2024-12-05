import React from "react"

import { useDragLayer } from "react-dnd"

import { TableCell } from "@mui/material"

import { TableContext } from "../../../contexts/MTableContextProvider"

interface IItemType {
  id: string
  label: string
  originalIndex: number
  ref: any
}

const DnDPreview = () => {

  const tableContext = React.useContext(TableContext)

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem() as IItemType,
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  if (!item || !item.ref || !isDragging || !currentOffset) {
    return null;
  }

  const { x: left, y: top } = currentOffset;
  const width = item?.ref?.current?.clientWidth || 100;
  const height = item?.ref?.current?.clientHeight || 100;

  return (
    <TableCell
      key={item.id}
      align="left"
      padding='none'
      sx={{ 
        position: "absolute",
        top,
        left,
        width,
        height,
        zIndex: 3090,
        pointerEvents: "none",
        background: tableContext.dndDragColor,
      }}
      className={`${tableContext.dndDragClass || ''} non-mouse-event`}
    >
      {item.label}
    </TableCell>
  );
};

export default DnDPreview;