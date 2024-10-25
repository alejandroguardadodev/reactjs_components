import React from 'react';

import { 
  IMSTblCell,
  IMSTblHead, 
  IMSTblKeyInputType
} from '../models/MSTableModel';

export interface TableContextType {
  heads: IMSTblHead[]
  inputHeads: IMSTblKeyInputType[]
  displayedHeads: IMSTblHead[]
  data: any[]
  hoverHeadKey: string | null
  render: (row:any) => [IMSTblCell[], string]
  updateHeadWidth: (key: string, width: number) => void
  setHoverHead: (key: string | null) => void
  moveHead: (head: IMSTblHead, index: number, atIndex: number) => void
}

const TableContext = React.createContext<TableContextType | null>(null);

export default TableContext