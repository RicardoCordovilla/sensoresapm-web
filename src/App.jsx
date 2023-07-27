import './App.css'

import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import ChartStation from './components/ChartStation'
import Login from './components/Login'
import { useState } from 'react'
import Dlete from './components/Dlete'
// import MosquitoPrb from './components/MosquitoPrb'


function App() {

  const [user, setUser] = useState(null)


  return (

    <div className='App'>

      <Routes>
        {/* <Route path='/' element={<Login user={user} setUser={setUser} />} /> */}
        {/* <Route path='/' element={<MosquitoPrb />} /> */}
        <Route path='/' element={<Home user={user} />} />
        <Route path='/:station' element={<ChartStation />} />
        <Route path='/dlete' element={<Dlete />} />
      </Routes>

    </div>
  )
}

export default App
