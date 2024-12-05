import { createTheme } from '@mui/material/styles'

const breakpoints = {
    values: {
      xs: 0,
      sm: 600, 
      md: 1050, 
      lg: 1400, 
      xl: 1736
    }
}

const theme = createTheme({
    breakpoints,
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            borderCollapse: 'collapse'
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            borderTop: '1px solid rgba(0,0,0,.2)',
            borderBottom: '1px solid rgba(0,0,0,.2)'
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: 'black !important',
            cursor: 'pointer',
            background: 'transparent',
            padding: '8px 4px 6px 6px',
            borderBottom: '0px',
            //border: '1px solid rgba(0,0,0,.4)',
            borderLeft: '1px solid rgba(0,0,0,.2) !important',
            transition: 'all .2s easy-in-out',
            '&:hover': {
                //border: '1px solid #6c7a89',
              background: 'rgba(0,0,0,.02)'
            },
            '&.DnDDragPreview': {
              border: '1px solid rgba(0,0,0,.2) !important',
              boxShadow: '0px 0px 5px -3px rgba(0,0,0,0.5)',
            },
            '&.left-border': {
              borderRight: '1px solid rgba(0,0,0,.2) !important',
            },
            '&.hover-data-cell': {
              // position: 'relative',
              // '&:hover:before': {
              //   content: "''",
              //   display: 'block',
              //   position: 'absolute',
              //   top: 0,
              //   left: 0,
              //   width: '100%',
              //   height: '100%',
              //   border: '1px solid rgba(0,0,0,.4)'
              // }
            }
          }
        }
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            color: 'black !important',
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
              fontSize: '.78rem',
              color: 'black !important'
            }
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: '.85rem'
          }
        }
      }
    }
})

export default theme