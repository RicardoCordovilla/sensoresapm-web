import './App.css'

import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import ChartStation from './components/ChartStation'


function App() {



  return (
    <div className='App'>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:station' element={<ChartStation />} />
      </Routes>

    </div>
  )
}

export default App
