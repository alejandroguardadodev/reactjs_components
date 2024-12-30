import React from 'react'

import { styled } from '@mui/system'

import { 
    Menu,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material'

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

export interface IAxisType {
    x: number
    y: number
}

export interface IContextMenuItemType {
    id?: number
    title?: string
    icon?: React.ReactNode
    divider?: boolean
}

interface MnContextMenuPropsType {
    open: boolean
    position: IAxisType
    items: IContextMenuItemType[]
    onClose: () => void,
    onClick?: (item: IContextMenuItemType) => void;
}

const MnContextMenu = ({open, position, items, onClose, onClick}:MnContextMenuPropsType) => {
    return (
        <Menu
            open={open}
            onClose={onClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: position.y, left: position.x }}
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
                {items && items.map((item, index) => item.divider?
                (
                    <Divider key={`item-${index}`}  component="li" />
                ):(
                    <MenuItem key={`item-${index}`} autoFocus={false} onClick={() => { onClick?.(item); onClose(); }}  >
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
    )
}

export default MnContextMenu