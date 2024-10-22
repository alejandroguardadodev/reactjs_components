import React from 'react'

import * as yup from "yup"

import { styled } from '@mui/system'

import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { InlineSchema } from '../../../../../../../schemas'

import Box from "@mui/material/Box"

import MSInput from '../../../../../../MSInput'

type SchemaType = yup.InferType<typeof InlineSchema>

const Form = styled('form')(() => ({
    width: '100%',
    padding: '1px 0px',
    margin: '0px',
}))

const Container = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'containerWidth',
})<{ containerWidth: number; }>(({ containerWidth }) => ({
    position: 'absolute',
    top: '-1px',
    left: '-1px',
    width: `${containerWidth + 2}px`,
    height: 'calc(100% + 2px)',
    border: '1px solid #038C65 !important',
    background: '#F4F3F2',
    zIndex: '1000',
    boxShadow: '0px 0px 15px -6px rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center'
}))

interface MSCellFormValuePropsType {
    id: string
    type: 'text' | 'number'
    title: string
    defaultValue?: string
    width?: number
    onSubmit?: (data:unknown) => void
}

const MSCellFormValue = ({ id, type, title, defaultValue="", width=300, onSubmit }:MSCellFormValuePropsType) => {
    
    const methods = useForm<SchemaType>({
        defaultValues: {
            data: defaultValue,
        },
        resolver: yupResolver(InlineSchema), 
        mode: "onChange"
    });
    
    const onFormSubmit = (data:SchemaType) => {
        onSubmit?.(data.data)
    }

    return (
        <Container containerWidth={width}>
            <FormProvider {...methods}>
                <Form onSubmit={methods.handleSubmit(onFormSubmit)}>
                    <Box sx={{ width: '100%' }}>
                        <MSInput id={id} type={type} placeholder={defaultValue} label={title} inline />
                    </Box>
                </Form>
            </FormProvider>
        </Container>
    )
}

export default MSCellFormValue