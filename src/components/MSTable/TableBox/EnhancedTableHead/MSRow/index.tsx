import React from 'react'

import { styled } from '@mui/system'

import {
    IMSTblCell,
    IMSTblKeyInputType
} from '../../../../../models/MSTableModel';

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
    data: (IMSTblCell | undefined)[]
    hoverHead: string | null
    items: null | MenuItemType[]
    inputHeaderKeys?: IMSTblKeyInputType[]
    action?: null | React.ReactNode
}

const MSRow = ({ data, hoverHead, action, items, inputHeaderKeys=[] }:MSRowPropsType) => {
    const cellRef = React.useRef<HTMLTableCellElement>(null);

    const [mousePosition, setMousePosition] = React.useState<null | MousePositionType>(null)
    const [cellAsField, setCellAsField] = React.useState<null | IMSTblKeyInputType>(null)

    const useMenu = React.useMemo(() => Boolean(items), [items])
    const openSubMenu = React.useMemo(() => Boolean(mousePosition), [mousePosition])

    const subMenuRealPosition = React.useMemo<MousePositionType>(() => {
        if (!openSubMenu) return { x:0, y:0 }
        if (!mousePosition) return { x: 0, y: 0 }

        return {
            x: mousePosition.x,
            y: mousePosition.y
        }
    }, [openSubMenu, mousePosition])

    const handleSubMenuClose = () => { setMousePosition(null); }

    const handleOutsideClick = (e:MouseEvent) => {
        if (!cellAsField) return

        if (cellRef.current && !cellRef.current.contains(e.target as Node)) {
            setCellAsField(null)
        }
    }

    React.useEffect(() => {
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
                    if (!useMenu) return;

                    event.preventDefault()
                    
                    if (!openSubMenu) {
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
                            ...(index == 0 && {
                                borderLeft: '0px !important'
                            }),
                            ...(index !== 0 && hoverHead == cell.key && {
                                borderLeft: '1px solid #038C65 !important'
                            })
                        }}
                        onDoubleClick={() => {
                            if (cellAsField) return 

                            var type: undefined | IMSTblKeyInputType;
                            if (type = inputHeaderKeys.find((h) => h.key == cell.key)) {
                                setCellAsField(type)
                            }
                        }}
                    >
                        <MSCellValue value={cell.value} showInputCell={Boolean(cellAsField) && cellAsField?.key == cell.key} inputCell={cellAsField} />
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