import React from 'react'

import { useFormContext } from "react-hook-form"
import { styled } from '@mui/system'

import {
  Stack,
  Typography,
  Tooltip
} from '@mui/material'

import NearbyErrorIcon from '@mui/icons-material/NearbyError'

import InputDateBase from './InputDateBase'

const FieldContainer = styled(Stack)(() => ({
  width: '100%' , 
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '4px',
  marginBottom: '10px',
}))

const InputContainer = styled(Stack, {
  shouldForwardProp: (props) => props !== "borderColor" && props !== 'isAnInline'
})<{ isAnInline:boolean; }>(({ borderColor, isAnInline }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%' , 
  border: `1px solid ${borderColor}`,
  borderRadius: '4px',
  transition: 'box-shadow .2s ease-in-out, border .2s ease-in-out',
  ...(isAnInline && {
      '& .input-component': {
          padding: '5px'
      }
  })
}))

const NomalInput = styled('input')(() => ({
  fontFamily: '"Montserrat" !important',
  fontSize: '.9rem',
  fontWeight: '400',
  flexGrow: '1',
  padding: '8px 5px 8px 10px',
  background: 'transparent',
  border: 'none !important',
  outline: 'none !important',
}))

interface MSInputPropsType {
  id: string
  placeholder?: string
  type?: "text" | "number" | "date"
  label?: string
  inline?: boolean
  disabled?: boolean
  defaultvalue?: number | string 
  triggerSubmit?: () => void
}

const MSInput = ({ id, label="", inline=false, disabled=false, defaultvalue="", placeholder="", type="text", triggerSubmit=undefined }:MSInputPropsType) => {

  //const [fieldvalue, setFieldvalue] = React.useState<string>(`${defaultvalue}`)

  const { register, setValue, watch, trigger, formState: { errors } } = useFormContext() 

  const isErr = React.useMemo(() => !!errors[id], [ errors, errors[id], id ])
  const errMessage = React.useMemo(():string => isErr? `${errors[id]!.message}` : '', [isErr, errors, id])

  const inputContainerBoderColor = React.useMemo<string>(() => {
    if (inline) return "transparent"

    if (isErr) return '#400101'

    return "#206C65"
  }, [inline, isErr])

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value)
        switch(type) {
          case "date":
            //trigger()
            if (!isErr && triggerSubmit) triggerSubmit()
            
            break
        }
    })

    return () => subscription.unsubscribe()
  }, [watch, id, type])


  const InputElement = React.useMemo<React.ReactNode>(() => {
    switch(type) {

      case "date":
        return <InputDateBase id={id} value={`${defaultvalue}`} setValue={setValue} />

      default:
        return <NomalInput autoFocus={inline} className='input-component' id={`input-${id}`} disabled={disabled} type={type} placeholder={placeholder} {...register(id)} />
    }
  }, [type, id, disabled, setValue, register, placeholder, defaultvalue])

  return (
    <FieldContainer sx={{ ...(inline && { padding: '0px !important', margin: '0px !important' }) }}>
      {label && !inline && (
        <label htmlFor={`input-${id}`}>
            <Typography variant='subtitle1' component="p">{label}</Typography>
        </label>
      )}

      <InputContainer borderColor={inputContainerBoderColor} isAnInline={inline}>
        {inline && isErr && (
            <Tooltip title={`${label} ${errMessage}`.trim()} arrow>
                <NearbyErrorIcon sx={{ color: '#400101', fontSize: '.9rem', paddingLeft: '4px' }} />
            </Tooltip>
        )}
        
        {InputElement}

      </InputContainer> 

      {isErr && !inline && (
        <Typography variant="caption" component="p" sx={{ color: '#400101', fontStyle: 'italic' }}>{errMessage}</Typography>
      )}  
    </FieldContainer>
  )
}

export default MSInput