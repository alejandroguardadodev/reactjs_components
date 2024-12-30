import React from 'react'

import { styled } from '@mui/system'

import { 
    Menu,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText
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

interface axis {
    x: number
    y: number
}

interface MenuItemType {
    id: number;
    title: string;
    icon?: React.ReactNode;
}

interface MCtxMenuPropsType {
    open: boolean
    position: axis
    items: MenuItemType[]
    onClose: () => void,
    onClick?: (item: MenuItemType) => void;
}

const MCtxMenu = ({open, position, items, onClose, onClick}: MCtxMenuPropsType) => {
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
                {items && items.map((item, index) => (
                    <MenuItem key={`item-${index}`} onClickCapture={onClose} onClick={() => { onClick?.(item); }}>
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

export default MCtxMenu