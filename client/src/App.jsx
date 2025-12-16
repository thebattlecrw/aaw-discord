import { useState } from 'react'
import StartPage from './pages/StartPage.jsx'
import HomePage from './pages/HomePage.jsx'
import EdtPage from './pages/EdtPage.jsx'
import EditPage from './pages/EditPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import { Routes, Route } from 'react-router-dom'

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<StartPage />}>
        <Route index element={<HomePage />} />
        <Route path="edt" element={<EdtPage />} />
        <Route path="edit" element={<EditPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  )
}