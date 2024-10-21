import React from 'react'

import { 
    IMSTblKeyInputType 
} from '../../../../../../models/MSTableModel'

import MSCellFormValue from './MSCellFormValue'

interface MSCellValuePropsType {
    value: string
    showInputCell: boolean
    inputCell: null | IMSTblKeyInputType
}

const MSCellValue = ({ value, showInputCell, inputCell }:MSCellValuePropsType) => {

    const useCellAsInput = React.useMemo(() => Boolean(inputCell), [inputCell])

    if (showInputCell && useCellAsInput) return (
        <MSCellFormValue id="data" title={inputCell?.key || ""} type={inputCell?.inputType || 'text'} defaultValue={value}/>
    )

    return value
}

export default MSCellValue