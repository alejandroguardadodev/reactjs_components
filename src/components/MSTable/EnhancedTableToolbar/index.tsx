import React from 'react'

import { 
    Toolbar,
    Typography,
    Tooltip,
    IconButton
} from '@mui/material'

import FilterListIcon from '@mui/icons-material/FilterList'

interface EnhancedTableToolbarPropsType {
    title: string
}

const EnhancedTableToolbar = ({ title }:EnhancedTableToolbarPropsType) => {
  return (
    <Toolbar
        sx={[
            {
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            },
        ]}
    >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
            {title}
        </Typography>

        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
    </Toolbar>
  )
}

export default EnhancedTableToolbar