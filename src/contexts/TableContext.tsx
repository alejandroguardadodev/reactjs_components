import React from 'react';

import { 
    IMSTblHead 
} from '../models/MSTableModel';

export interface TableContextType {
  heads: IMSTblHead[]
  updateHeadWidth: (key: string, width: number) => void
}

const TableContext = React.createContext<TableContextType | null>(null);

export default TableContext