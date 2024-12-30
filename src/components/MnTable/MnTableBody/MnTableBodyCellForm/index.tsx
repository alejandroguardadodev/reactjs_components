import React from 'react'

import { styled } from '@mui/system'

import { FormProvider, useForm } from 'react-hook-form'

import MnInlineInputForm from '../../../inputs/MnInlineInputForm'

interface IMnTableBodyCellFormPropsType {
    width: number
    defaultValue: string
    type: 'text' | 'date' 
    onClose: () => void
    onSubmit: (value: string) => void
    onErrorInput?: (error: boolean) => void
}

const CellFormContainer = styled('div', {
    shouldForwardProp: (prop) => prop !== 'containerWidth'
})<{ containerWidth: number }>(({ containerWidth }) => ({
    position: 'absolute',
    top: '0',
    left: '0',
    width: `${containerWidth}px`,
    height: 'calc(100%)',
    background: 'transparent',
    zIndex: '1000',
    padding: 0,
    margin: 0,
}))

const Form = styled('form')(() => ({
    width: '100%',
    padding: '1px 0px',
    margin: '0px',
    display: 'flex',
    alignItems: 'center',
}))

const MnTableBodyCellForm = ({ defaultValue, width, type, onClose, onSubmit, onErrorInput }:IMnTableBodyCellFormPropsType) => {
    
    const methods = useForm<{ data: string }>({
        defaultValues: {
            data: defaultValue,
        },
        shouldUseNativeValidation: true,
        mode: "onChange"
    });
    
    const onFormSubmit = (data:{ data: string }) => {
        onSubmit(data.data)
        onClose()
    }

    return (
        <CellFormContainer containerWidth={width}>
            <FormProvider {...methods}>
                <Form onSubmit={methods.handleSubmit(onFormSubmit)}>
                    <MnInlineInputForm id="data" required onErrorChange={onErrorInput} />
                </Form>
            </FormProvider>
        </CellFormContainer>
    )
}

export default MnTableBodyCellForm