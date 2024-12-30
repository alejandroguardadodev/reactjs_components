import React, { ReactNode } from 'react'
import update from 'immutability-helper'

import { IKeyValue } from '../../interfaces'

import { IContextMenuItemType } from '../../components/MnContextMenu'

// INTERFACES ---------------------------------------------
export interface InputDataType {
    type?: 'text' | 'date'
    onSubmit?: (data:IKeyValue, id?:string) => void
}

export interface INewElementInputFormType {
    type: 'text' | 'date'
    key: string
    label: string
    onSubmit: (value: string) => void
}

export interface ITableHeaderDataType {
    key: string // HEADER ID
    label: string // HEADER LABEL TEXT

    blockDnD?: boolean // BLOCK DRAG AND DROP
    responsiveHide?: 'sm' | 'md' | 'lg' | 'xl' // SHOW COLUMN DEPENDING OF BREAKPOINTS
    width?: number // COLUMN WIDTH
    hide?: boolean // HIDE COLUMN
    input?: InputDataType // INPUT DATA
    minWidth?: number
    maxWidth?: number
    blockHide?: boolean
}

export interface TableContextPropsType {
    header: ITableHeaderDataType[]
    rows: any[] 
    loading?: boolean

    hoverBorderColor?: string
    blinkColor: string
    dndDragColor: string

    minColumnWidth?: number
    maxColumnWidth?: number
    isResizing?: boolean
    dndDragClass?: string

    order?: "asc" | "desc"
    orderBy?: string
    hoverHeadKey?: string | null
    minHeight?: number | null
    maxHeight?: number | null
    allowdAddColumn?: boolean
    newElementForm?: INewElementInputFormType
    rowSubMenuItems?: IContextMenuItemType[]

    render: (row:any) => [IKeyValue[], string] 

    onClickSubMenuRow?: (opt: number, data?: [IKeyValue[], string]) => void
    setHoverHead?: (key: string | null) => void
    setIsResizing?: (isResizing: boolean) => void
    moveHead?: (head: ITableHeaderDataType, index: number, atIndex: number) => void
    handleRequestSort?: (propertyKey: string ) => void
    requestSort?: (propertyKey: string, order: 'asc' | 'desc') => void
    updateColumnWidth?: (key: string, width: number) => void
    hideColumn?: (key: string) => void
}

const initValue:TableContextPropsType = {
    rows: [],
    order: 'asc',
    minHeight: null,
    maxHeight: null,
    isResizing: false,
    header: [],
    loading: false,
    hoverHeadKey: null,
    orderBy: '',
    minColumnWidth: 150,
    maxColumnWidth: 400,
    blinkColor: 'white',
    dndDragColor: 'white',
    dndDragClass: '',
    allowdAddColumn: false,
    render: () => [[], ""]
}

export const TableContext = React.createContext<TableContextPropsType>(initValue)

interface TableContextProviderPropsType extends TableContextPropsType {
    children: ReactNode
}

const TableContextProvider: React.FC<TableContextProviderPropsType> = ({ children, ...props }) => {
    const [data, setData] = React.useState<TableContextPropsType>({
        rows: props.rows ?? initValue.rows,
        header: (props.header ?? initValue.header).map((h) => {
            const minWidth =  h.minWidth ?? props.minColumnWidth ?? initValue.minColumnWidth
            const maxWidth =  h.maxWidth ?? props.maxColumnWidth ?? initValue.maxColumnWidth
    
            return {
                ...h,
                width: minWidth,
                minWidth,
                maxWidth,
            }
        }),
        minHeight: props.minHeight ?? initValue.minHeight,
        maxHeight: props.maxHeight ?? initValue.maxHeight,
        order: props.order ?? initValue.order,
        orderBy: props.orderBy ?? initValue.orderBy,
        hoverHeadKey: props.hoverHeadKey ?? initValue.hoverHeadKey,
        blinkColor: props.blinkColor ?? initValue.blinkColor,
        isResizing: props.isResizing ?? initValue.isResizing,
        dndDragColor: props.dndDragColor ?? initValue.dndDragColor,
        dndDragClass: props.dndDragClass ?? initValue.dndDragClass,
        allowdAddColumn: props.allowdAddColumn ?? initValue.allowdAddColumn,
        loading: props.loading ?? initValue.loading,
        minColumnWidth: props.minColumnWidth ?? initValue.minColumnWidth,
        maxColumnWidth: props.maxColumnWidth ?? initValue.maxColumnWidth,
        hoverBorderColor: props.hoverBorderColor ?? initValue.hoverBorderColor,
        newElementForm: props.newElementForm ?? initValue.newElementForm,
        rowSubMenuItems: props.rowSubMenuItems ?? initValue.rowSubMenuItems,
        onClickSubMenuRow: props.onClickSubMenuRow ?? initValue.onClickSubMenuRow,

        render: props.render ?? initValue.render,
        setHoverHead: (key: string | null) => {
            setData((data) => ({
                ...data,
                hoverHeadKey: key
            }))
        },
        setIsResizing: (resizing: boolean) => {
            setData((data) => ({
                ...data,
                isResizing: resizing
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
        requestSort: (propertyKey: string, order: 'asc' | 'desc') => {
            setData((data) => ({
                ...data,
                order: order,
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

            // setOriginalHeader((originalHeader) => update(originalHeader, {
            //     [originalHeader.findIndex((h) => h.key === key)]: {
            //         width: {
            //             $set: newWidth
            //         }
            //     }
            // }))
        },
        hideColumn: (key: string) => {

            setData((data) => update(data, {
                header: {
                    [data.header.findIndex((h) => h.key === key)]: {
                        hide: {
                            $set: true
                        }
                    }
                }
            }))

            // setOriginalHeader((originalHeader) => update(originalHeader, {
            //     [originalHeader.findIndex((h) => h.key === key)]: {
            //         hide: {
            //             $set: true
            //         }
            //     }
            // }))
        }
    })

    React.useEffect(() => {
        setData((data) => update(data, {
            rows: {
                $set: props.rows
            }
        }))
    }, [props.rows])

    return (
        <TableContext.Provider value={data}>
            {children}
        </TableContext.Provider>
    )
}

export default TableContextProvider