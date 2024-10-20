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
            padding: '8px 2px 4px 6px',
            borderBottom: '0px',
            //border: '1px solid rgba(0,0,0,.4)',
            borderLeft: '1px solid rgba(0,0,0,.2) !important',
            transition: 'border .2s easy-in-out, background .2s easy-in-out',
            '&:hover': {
                //border: '1px solid #6c7a89',
              background: 'rgba(0,0,0,.02)'
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
      }
    }
})

export default theme