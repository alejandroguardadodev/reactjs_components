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
}

const MSRow = ({ data, hoverHead }:MSRowPropsType) => {
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
        </TableRow>
    </>
  )
}

export default MSRow