import { createTheme } from '@mui/material/styles'

const breakpoints = {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    }
}

const theme = createTheme({
    breakpoints,
    components: {
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(0,0,0,.2)',
            '&.MuiTableRow-head': {
              borderTop: '1px solid rgba(0,0,0,.2)',
            }
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            position: 'relative',
            background: 'transparent',
            padding: '8px 4px 6px 6px',
            borderBottom: '0px',
            borderLeft: '1px solid rgba(0,0,0,.2) !important',
            transition: 'all .2s easy-in-out',
            '&:last-child': {
              borderRight: '1px solid rgba(0,0,0,.2) !important',
            },
            '&:hover': {
              background: 'rgba(0,0,0,.02)',
              cursor: 'pointer',
              '&.allow-border-hover::before': {
                content: '""',
                position: 'absolute',
                top: '-1px',
                left: '-1px',
                width: 'calc(100% + 2px)',
                height: 'calc(100% + 2px)',
                border: '1px solid red',
                zIndex: 99999,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            },
            '&.DnDDragPreview': {
              border: '1px solid rgba(0,0,0,.2) !important',
              boxShadow: '0px 0px 5px -3px rgba(0,0,0,0.5)',
            },
            '&.last-border': {
              borderRight: '1px solid rgba(0,0,0,.2) !important',
            },
            '& .row-item-hover': {
              display: 'none'
            },
            '&:hover .row-item-hover': {
              display: 'flex',
            }
          }
        }
      },
      MuiMenu: {
        styleOverrides: {
          root: {
            '& .MuiPaper-root': {
              border: '1px solid rgba(0,0,0,.3) !important'
            }
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '& svg': {
              fontSize: '.9rem !important',
              color: 'rgba(0,0,0,.6) !important'
            },
            border: '0px !important',
            outline: 'none !important',
            '&:focus':{
              outline: 'none !important'
            },
            '&:hover':{
              outline: 'none !important'
            }
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: '.85rem !important'
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&.MnRow-Button': {
              padding: '0px !important',
              paddingRight: '5px !important',
              paddingLeft: '5px !important',
              '& svg': {
                fontSize: '1.1rem !important',
                color: 'rgba(0,0,0,.7) !important'
              }
            }
          }
        }
      }
    }
})

export default theme