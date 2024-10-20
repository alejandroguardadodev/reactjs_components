import { BrowserRouter as Router, Route, Routes } from  'react-router-dom'

import { DndProvider } from 'react-dnd'
import { ThemeProvider } from '@mui/material/styles'

import theme from './theme'
import { HTML5Backend } from 'react-dnd-html5-backend'

import CssBaseline from '@mui/material/CssBaseline'

import HomePage from './pages/HomePage'

function App() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            
            <Routes>
              <Route path='/' element={<HomePage />} />
            </Routes>
          
          </ThemeProvider>
        </Router>
      </DndProvider>
    </>
  )
}

export default App
