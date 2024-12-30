import { BrowserRouter as Router, Route, Routes } from  'react-router-dom'

import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'

import theme from './theme'
import store from './store'

import CssBaseline from '@mui/material/CssBaseline'

import Tablev2Page from './pages/Tablev2Page'

// import HomePage from './pages/HomePage'
// import TablePage from './pages/TablePage'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          
          <Routes>
            <Route path='/' element={<Tablev2Page />} />
            {/* <Route path='/table' element={<TablePage />} /> */}
          </Routes>
        
          <ToastContainer />
        </ThemeProvider>
      </Router>
    </Provider>
  )
}

export default App
