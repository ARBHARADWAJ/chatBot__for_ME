import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

const App = () => {
  return (
<Routes>
  <Route path='/' element={<h1 class="text-3xl font-bold underline">Welcome to the Home Page</h1>} />
  <Route path='/register' element={<RegisterPage/>}/>
  <Route path='/login' element={<LoginPage/>}/>
</Routes>
  )
}

export default App