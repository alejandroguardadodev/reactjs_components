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
}

const MSCellValue = ({ value, showInputCell, inputCell, inputCellWidth=0, containerXLimit=0, cellXpos=0 }:MSCellValuePropsType) => {

    const useCellAsInput = React.useMemo(() => Boolean(inputCell), [inputCell])
    
    if (showInputCell && useCellAsInput) return (<>
        <MSCellFormValue 
            id="data" 
            defaultValue={value} 
            title={inputCell?.key || ""} 
            type={inputCell?.inputType || 'text'} 
            width={Math.max(inputCellWidth, 300)}
            cellXpos={cellXpos}
            containerXLimit={containerXLimit}
            onSubmit={inputCell?.onSubmit}
        />
        {value}
    </>)

    return value
}

export default MSCellValue