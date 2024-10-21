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

interface MSCellFormValuePropsType {
    id: string
    type: 'text' | 'number'
    title: string
    defaultValue?: string
    onSubmit?: (data:unknown) => void
}

const MSCellFormValue = ({ id, type, title, defaultValue="", onSubmit }:MSCellFormValuePropsType) => {
    
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
        <FormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(onFormSubmit)}>
                <Box sx={{ width: '100%' }}>
                    <MSInput />
                </Box>
            </Form>
        </FormProvider>
    )
}

export default MSCellFormValue