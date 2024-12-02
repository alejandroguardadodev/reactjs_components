import { BrowserRouter as Router, Route, Routes } from  'react-router-dom'

import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { ThemeProvider } from '@mui/material/styles'

import theme from './theme'
import store from './store'

import { HTML5Backend } from 'react-dnd-html5-backend'

import CssBaseline from '@mui/material/CssBaseline'

import HomePage from './pages/HomePage'
import TablePage from './pages/TablePage'

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/table' element={<TablePage />} />
            </Routes>
          
          </ThemeProvider>
        </Router>
      </DndProvider>
    </Provider>
  )
}

export default App
