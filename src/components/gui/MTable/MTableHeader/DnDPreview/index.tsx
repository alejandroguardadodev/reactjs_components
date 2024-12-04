import { useDragLayer } from "react-dnd";

import { Box } from "@mui/material";

const DnDPreview = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  if (!item || !isDragging || !currentOffset) {
    return null;
  }

  const { x: left, y: top } = currentOffset;
  const width = item?.ref?.current?.clientWidth || 100;
  const height = item?.ref?.current?.clientHeight || 100;

  return (
    <Box sx={{
        position: "absolute",
        top,
        left,
        width,
        height,
        zIndex: 3090,
        pointerEvents: "none",
        background: 'red'
    }}>
      TEST
    </Box>
  );
};

export default DnDPreview;