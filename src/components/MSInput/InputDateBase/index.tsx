import React from 'react'

import styled from 'styled-components'

import { FieldValues, UseFormSetValue } from "react-hook-form"

import DatePicker, { DateObject } from "react-multi-date-picker"

const DateContainer = styled.div`
    flex-grow: 1;
    &>.rmdp-container {
        width: 100%;
        &>input {
            font-family: "Montserrat" !important;
            font-size: 1rem;
            font-weight: 400;
            width: 100%;
            padding: 11px 5px 11px 10px;
            background: transparent;
            border: none !important;
            outline: none !important;
            height: fit-content !important;
            box-shadow: none !important;
        }
    }

    &.disabled {
        &>.rmdp-container>input {
            color: grey;
            background: rgba(0, 0, 0, .05);
        }
    }
`;

interface InputDateBasePropsType {
    id: string
    value: string
    onChange: (value: string) => void
    onClose: () => void
}

const dateToString = (date: DateObject) => {
    return `${date.month}/${date.day}/${date.year}`
}

const InputDateBase = ({id, value, onChange, onClose}: InputDateBasePropsType) => {

    const [date, setDate] = React.useState<string>("")

    const datevalue = React.useMemo(() => {

        const datevalue = (date && date !== "")? date : value

        if (datevalue) {
            // if (value instanceof DateObject) return value
            // else if (value instanceof Date) {
            //     return new DateObject().set({
            //         year: value.getFullYear(),
            //         month: value.getMonth(),
            //         day: value.getTime(),
            //     }) 
            // }
            // else 
            if (typeof datevalue === "string" && datevalue !== "") {
                const [m, d, y] = datevalue.split("/")
                
                return new DateObject().set({
                    year: parseInt(y? y : "0"),
                    month: parseInt(m? m : "0"),
                    day: parseInt(d? d : "0"),
                })  
            }
        }
        
        return null

    }, [value, date])

    return (
        <DateContainer>
            <DatePicker 
                id={`input-${id}`}
                value={datevalue}
                format="MM/DD/YYYY"
                className='input-component'
                onChange={(date:DateObject) => {
                    if (date?.isValid) {
                        onChange(dateToString(date))
                        setDate(dateToString(date))
                    }
                }}
                onClose={onClose}
            />
        </DateContainer>
    )
}

export default InputDateBase