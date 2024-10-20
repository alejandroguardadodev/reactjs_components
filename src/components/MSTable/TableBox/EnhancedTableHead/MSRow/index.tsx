import React from 'react'

import {
    IMSTblCell
} from '../../../../../models/MSTableModel';

import { 
    TableRow,
    TableCell
} from '@mui/material'

interface MSRowPropsType {
    data: (IMSTblCell | undefined)[]
    hoverHead: string | null
    action?: null | React.ReactNode
}

const MSRow = ({ data, hoverHead, action }:MSRowPropsType) => {
    return (
        <>
            <TableRow
                hover
                tabIndex={-1}
                sx={{ cursor: 'pointer' }}
            >
                {data.filter((row) => row !== undefined).map((row, index) => (
                    <TableCell
                        key={`col-${row.key}-${index}`}
                        className='hover-data-cell'
                        sx={{
                            ...(index == 0 && {
                                borderLeft: '0px !important'
                            }),
                            ...(index !== 0 && hoverHead == row.key && {
                                borderLeft: '1px solid #038C65 !important'
                            })
                        }}
                    >
                        {row.value}
                    </TableCell>
                ))}

                { action && (<TableCell
                        sx={{ 
                            textTransform: 'capitalize',
                            width: '20px',
                            padding: '4px',
                        }}
                        align="left"
                    >
                        {action}
                    </TableCell>) }
            </TableRow>
        </>
    )
}

export default MSRow