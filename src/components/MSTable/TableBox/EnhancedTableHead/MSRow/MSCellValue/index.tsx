import React from 'react'

import { 
    IMSTblKeyInputType 
} from '../../../../../../models/MSTableModel'

import MSCellFormValue from './MSCellFormValue'

interface MSCellValuePropsType {
    value: string
    showInputCell: boolean
    inputCell: null | IMSTblKeyInputType
    inputCellWidth?: number
    containerXLimit?: number
    cellXpos?: number
    rowId?: string,
    onClose?: () => void
}

const MSCellValue = ({ value, showInputCell, inputCell, onClose, inputCellWidth=0, containerXLimit=0, cellXpos=0, rowId="" }:MSCellValuePropsType) => {

    const useCellAsInput = React.useMemo(() => Boolean(inputCell), [inputCell])
    
    if (showInputCell && useCellAsInput) return (<>
        <MSCellFormValue 
            id={inputCell?.key || ""}
            rowId={rowId}
            defaultValue={value} 
            type={inputCell?.inputType || 'text'} 
            width={Math.max(inputCellWidth, 300)}
            cellXpos={cellXpos}
            containerXLimit={containerXLimit}
            onSubmit={inputCell?.onSubmit}
            onClose={onClose}
        />
        {value}
    </>)

    return value
}

export default MSCellValue