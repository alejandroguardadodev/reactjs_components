import React from 'react'

import * as yup from "yup"

import { styled } from '@mui/system'

import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { InlineSchema } from '../../../../../../../schemas'

import Box from "@mui/material/Box"

import MSInput from '../../../../../MSInput'

type SchemaType = yup.InferType<typeof InlineSchema>

interface IKeyValue {
    key: string
    value: string
}

const Form = styled('form')(() => ({
    width: '100%',
    padding: '1px 0px',
    margin: '0px',
}))

const Container = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'containerWidth' && prop !== 'rightPos',
})<{ containerWidth: number; rightPos: boolean; }>(({ containerWidth, rightPos }) => ({
    position: 'absolute',
    top: '-1px',
    ...(!rightPos && {
        left: '-1px',
    }),
    ...(rightPos && {
        right: '-1px',
    }),
    width: `${containerWidth + 2}px`,
    height: 'calc(100% + 2px)',
    border: '1px solid #038C65 !important',
    background: '#F4F3F2',
    zIndex: '1000',
    boxShadow: '0px 0px 15px -6px rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
}))

interface MSCellFormValuePropsType {
    id: string
    type: 'text' | 'number' | 'date'
    defaultValue?: string
    width?: number
    containerXLimit?: number
    cellXpos?: number
    rowId?: string
    onSubmit?: (data:IKeyValue, id?:string) => void
    onClose?: () => void
}

const MSCellFormValue = ({ id, type, onClose, defaultValue="", width=300, containerXLimit=0, cellXpos=0, rowId="", onSubmit }:MSCellFormValuePropsType) => {
    
    const formRef = React.useRef<HTMLFormElement>(null);

    const methods = useForm<SchemaType>({
        defaultValues: {
            data: defaultValue,
        },
        resolver: yupResolver(InlineSchema), 
        mode: "onChange"
    });

    const offsetXLimit = React.useMemo(() => width + cellXpos, [width, cellXpos])
    
    const onFormSubmit = (data:SchemaType) => {
        onSubmit?.({
            key: id,
            value: `${data.data}`.trim()
        }, rowId)
        
        onClose?.()
    }

    const triggerSubmit = () => { methods.handleSubmit(onFormSubmit)(); };    

    return (
        <Container containerWidth={width} rightPos={offsetXLimit >= containerXLimit}>
            <FormProvider {...methods}>
                <Form ref={formRef} onSubmit={methods.handleSubmit(onFormSubmit)}>
                    <Box sx={{ width: '100%' }}>
                        <MSInput id="data" type={type} placeholder={defaultValue} defaultvalue={defaultValue} triggerSubmit={triggerSubmit} inline />
                    </Box>
                </Form>
            </FormProvider>
        </Container>
    )
}

export default MSCellFormValue