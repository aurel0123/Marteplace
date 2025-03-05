import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from '@/features/Dashboard/Dashboard'
import Home from '@/features/Dashboard/Home'
import RegistrationForm from '@/features/auth/Register'
import Otp from '@/features/auth/Otp'
import Categories from '@/features/categories/Categories'
import Landingpage from '@/features/LandingPages/Landingpage'
export default function routes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage/>} />
        <Route path='register' element = {<RegistrationForm/>} />
        <Route path='auth/otp' element = {<Otp/>}/>
        <Route path = "dashboard" element = {<Dashboard/>} >
          <Route index element = {<Home/>}/>
          <Route path='categories' element = {<Categories/>} />
        </Route>
      </Routes>
    </Router>
  )
}
