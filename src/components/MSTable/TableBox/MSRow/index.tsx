import React, { MouseEventHandler } from 'react'

import { styled } from '@mui/system'

import {
    IMSTblCell,
    IMSTblKeyInputType
} from '../../../../models/MSTableModel';

import {
    Menu,
    MenuList,
    MenuItem,
    ListItemText,
    ListItemIcon,
    TableRow,
    TableCell
} from '@mui/material'

import MSCellValue from './MSCellValue';

const MenuListItemIcon = styled(ListItemIcon)(() => ({
    '& svg': {
        fontSize: '1.2rem',
        color: 'rgba(0, 0, 0, .5) !important'
    } 
}))

const MenuListItemText = styled(ListItemText)(() => ({
    fontSize: '1rem',
    color: 'black !important'
}))

interface MousePositionType {
    x: number;
    y: number;
}

interface MenuItemType {
    title: string;
    icon?: React.ReactNode;
}

interface MSRowPropsType {
    data: (IMSTblCell | undefined)[] // DATA TO BE RENDER ON THE TABLE
    hoverHead: string | null // KNOW WHICH HEAD IS HOVERED SO THE CORRESPONDING CELL WILL BE HIGHLIGHTED
    items: null | MenuItemType[] //SUB MENU ITEMS
    inputHeaderKeys?: IMSTblKeyInputType[] // SPECIFIC HEADS THAT NEED TO BE RENDERED AS INPUT
    action?: null | React.ReactNode // ACTION TO BE RENDERED ON THE LAST CELL
    containerXLimit?: number // LIMIT THE X POSITION OF THE TABLE TO BE RENDERED
    id?: string
}

const MSRow = ({ data, hoverHead, action, items, inputHeaderKeys=[], containerXLimit=0, id="" }:MSRowPropsType) => {
    const cellRef = React.useRef<HTMLTableCellElement>(null) // GET THE APROPIATE CELL REF TO SHOW THE MENU

    const [mousePosition, setMousePosition] = React.useState<null | MousePositionType>(null) // USED FOR THE SUB MENU
    const [cellAsField, setCellAsField] = React.useState<null | IMSTblKeyInputType>(null) // INPUT INFORMATION BY CELLS
    const [lineCellBorder, setLineCellBorder] = React.useState<null | string>(null) // USED TO SHOW THE LINE CELL BORDER
    const [currentCellX, setCurrentCellX] = React.useState<number>(0) // USED TO SHOW THE LINE CELL BORDER
    const [currentInputCellWidth, setCurrentInputCellWidth] = React.useState<number>(0) // USED TO SHOW THE LINE CELL BORDER

    const useMenu = React.useMemo(() => Boolean(items), [items]) // KNOW IF THE ROW HAS A SUB MENU
    const openSubMenu = React.useMemo(() => Boolean(mousePosition), [mousePosition]) // USE MOUSE POSITION TO KNOW IF THE SUB MENU IS OPEN

    //const currentInputCellWidth = React.useMemo(() => (Boolean(cellRef) && Boolean(cellRef.current))? cellRef.current?.clientWidth : 0, [cellRef]) // GET THE WIDTH OF THE CURRENT INPUT CELL

    const subMenuRealPosition = React.useMemo<MousePositionType>(() => {
        if (!openSubMenu) return { x:0, y:0 } // IF THE SUB MENU IS NOT OPEN, RETURN A DEFAULT POSITION
        if (!mousePosition) return { x: 0, y: 0 } // IF THE MOUSE POSITION IS NOT DEFINED, RETURN A DEFAULT POSITION

        // SAVED MOUSE POSITION
        return {
            x: mousePosition.x,
            y: mousePosition.y
        }
    }, [openSubMenu, mousePosition])

    const handleSubMenuClose = () => { setMousePosition(null); } // CLOSE THE SUB MENU BY CLEARING THE MOUSE POSITION VAR
    const clearLineCellBorder = () => { setLineCellBorder(null) } // CLEAR THE LINE CELL BORDER

    const closeCellAsInput = () => { 
        setCellAsField(null) // IF THE CLICK IS OUTSIDE THE CELL, CLEAR THE CELL AS FIELD
        clearLineCellBorder() // remove line cell border
        setCurrentCellX(0)
    } // CLOSE THE CELL AS INPUT

    const handleOutsideClick = (e:MouseEvent) => {
        if (!cellAsField) return // IF THERE IS NOT ANY CELL AS FIELD, DO NOTHING
        
        if (cellRef.current && !cellRef.current.contains(e.target as Node)) {
            closeCellAsInput() // remove line cell border
        }
    }

    React.useEffect(() => { // ADD EVENT LISTENER TO HANDLE OUTSIDE CLICKS
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
    })

    return (
        <>
            <TableRow
                hover
                tabIndex={-1}
                sx={{ cursor: 'pointer' }}
                onContextMenu={(event) => {
                    if (!useMenu) return; // CHECK IF THE SUB MENU IS ENABLED

                    event.preventDefault() 
                    
                    if (!openSubMenu) { // SAVE THE MOUSE POSITION IF THE SUB MENU IS NOT OPEN
                        setMousePosition({
                            x: event.clientX,
                            y: event.clientY,
                        })
                    }
                }} 
            >
                {data.filter((cell) => cell !== undefined).map((cell, index) => (
                    <TableCell
                        key={`col-${cell.key}-${index}`}
                        ref={(Boolean(cellAsField) && cellAsField?.key == cell.key)? cellRef : null}
                        className='hover-data-cell'
                        sx={{
                            position: 'relative',
                            '&:hover': {
                                border: '1px solid black !important',
                                boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.75)',
                                ...(index == 0 && lineCellBorder !== cell.key && {
                                    borderLeft: '0px !important'
                                })
                            },
                            ...(index == 0 && { 
                                borderLeft: '0px !important'
                            }),
                            ...(hoverHead == cell.key && {
                                borderLeft: '1px solid #038C65 !important'
                            }),
                            ...(Boolean(lineCellBorder) && lineCellBorder == cell.key && {
                                border: '1px solid transparent !important',
                                // padding: '0px !important'
                            }),
                        }}
                        onDoubleClick={(e) => {
                            if (cellAsField) return 
                            
                            var type: undefined | IMSTblKeyInputType;
                            if (type = inputHeaderKeys.find((h) => h.key == cell.key)) {
                                setCellAsField(type)
                                setLineCellBorder(cell.key)
                                
                                if(e) {
                                    setCurrentCellX(Math.floor(e.pageX))
                                    setCurrentInputCellWidth(Math.round(e.currentTarget.clientWidth))
                                }
                            }
                        }}
                    >
                        <MSCellValue 
                            cellKey={cell.key}
                            value={cell.value} 
                            showInputCell={Boolean(cellAsField) && cellAsField?.key == cell.key} 
                            inputCell={cellAsField} 
                            inputCellWidth={currentInputCellWidth}
                            containerXLimit={containerXLimit}
                            cellXpos={currentCellX}
                            rowId={id}
                            onClose={closeCellAsInput}
                        />
                    </TableCell>
                ))}

                { action && (<TableCell
                    sx={{ 
                        textTransform: 'capitalize',
                        width: '20px',
                        padding: '4px',
                    }}
                    align="left"
                >
                    {action}
                </TableCell>) }
            </TableRow>

            <Menu
                open={openSubMenu}
                onClose={handleSubMenuClose}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                anchorReference="anchorPosition"
                anchorPosition={{ top: subMenuRealPosition.y, left: subMenuRealPosition.x }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuList sx={{ padding: '0px !important' }}>
                    {items && items.map((item, index) => (
                        <MenuItem key={`item-${index}`} onClickCapture={handleSubMenuClose}>
                            {item.icon && (
                                <MenuListItemIcon>
                                    {item.icon}
                                </MenuListItemIcon>
                            )}
                            <MenuListItemText>{ item.title }</MenuListItemText>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </>
    )
}

export default MSRow