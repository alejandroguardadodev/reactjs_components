import React, { ReactNode } from 'react';
import update from 'immutability-helper'

interface IKeyValue {
    key: string
    value: string
}

// TABLE HEADER -----------------------------------------------------
interface BooleanBreakpointsType {
    xs: boolean
    sm: boolean 
    md: boolean 
    lg: boolean 
    xl: boolean
}

interface InputDataType {
    inputType?: 'text' | 'number' | 'date'
    onSubmit?: (data:IKeyValue, id?:string) => void
}

export interface MTblHeaderDataType {
    key: string // ID
    label: string // TEXT

    blockDnD?: boolean
    hide?: BooleanBreakpointsType 
    width?: number
    input?: InputDataType
}

// ------------------------------------------------------------------

// Define the context props type
export interface MTableContextPropsType {
    header: MTblHeaderDataType[]

    minColumnWidth?: number
    maxColumnWidth?: number

    order?: 'asc' | 'desc'
    orderBy?: string
    hoverHeadKey?: string | null
    minHeight?: number | null
    maxHeight?: number | null

    setHoverHead?: (key: string | null) => void
    moveHead?: (head: MTblHeaderDataType, index: number, atIndex: number) => void
    handleRequestSort?: (propertyKey: string ) => void
    updateColumnWidth?: (key: string, width: number) => void
}

// Initialize the default values
const initValue: MTableContextPropsType = {
    order: 'asc',
    minHeight: null,
    maxHeight: null,
    header: [],
    hoverHeadKey: null,
    setHoverHead: undefined,
    moveHead: undefined,
    handleRequestSort: undefined,
    updateColumnWidth: undefined,
    orderBy: '',
    minColumnWidth: 150,
    maxColumnWidth: 400
};

// Create the context with the default value
export const TableContext = React.createContext<MTableContextPropsType>(initValue);

// Define the props for the provider component
interface MTableContextProviderProps extends MTableContextPropsType {
    children: ReactNode; // Explicitly typing the children prop
}

// The provider component
const MTableContextProvider: React.FC<MTableContextProviderProps> = ({ children, ...props }) => {

    const [data, setData] = React.useState<MTableContextPropsType>({
        minHeight: props.minHeight ?? initValue.minHeight,
        maxHeight: props.maxHeight ?? initValue.maxHeight,
        header: props.header ?? initValue.header,
        order: props.order ?? initValue.order,
        orderBy: props.orderBy ?? initValue.orderBy,
        hoverHeadKey: props.hoverHeadKey ?? initValue.hoverHeadKey,

        setHoverHead: (key: string | null) => {
            setData((data) => ({
                ...data,
                hoverHeadKey: key
            }))
        },
        moveHead: (head, index, atIndex) => {
            setData((data) => update(data, {
                header: {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, head],
                    ],
                }
            }))
        },
        handleRequestSort: (propertyKey: string ) => {
            setData((data) => ({
                ...data,
                order: data.orderBy === propertyKey && data.order === 'asc' ? 'desc' : 'asc',
                orderBy: propertyKey
            }))
        },
        updateColumnWidth: (key: string, newWidth: number) => {
           setData((data) => update(data, {
                header: {
                    [data.header.findIndex((h) => h.key === key)]: {
                        width: {
                            $set: newWidth
                        }
                    }
                }
            }))
        },
    })


    return (
        <TableContext.Provider value={data}>
            {children}
        </TableContext.Provider>
    );
}

export default MTableContextProvider;