import React from 'react'

import { styled } from '@mui/system'

import { useFormContext } from "react-hook-form"

import { 
    Tooltip
} from '@mui/material'

const ForTextInput = styled('input')(() => ({
    fontSize: '.9rem',
    fontWeight: '400',
    flexGrow: '1',
    border: 'none !important',
    outline: 'none !important',
}))

interface MnInlineInputFormPropsType {
    id: string
    required: boolean
    onErrorChange?: (error: boolean) => void
}

const MnInlineInputForm = ({ id, required, onErrorChange }:MnInlineInputFormPropsType) => {

    const { register, formState: { errors } } = useFormContext() 

    const errMessage = React.useMemo(():string => !!errors[id]? `${errors[id]!.message}` : '', [errors, id])

    React.useEffect(() => {
        onErrorChange?.(!!errors[id])
    }, [errors, id])

    return (
        <>
            <Tooltip title={errMessage}>
                <ForTextInput autoFocus {...register(id, { ...(required && { required: 'is required' }) })} />
            </Tooltip>
        </>
    )
}

export default MnInlineInputForm