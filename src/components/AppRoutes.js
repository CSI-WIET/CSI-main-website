import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

// Code-split pages to reduce initial bundle size
// NOTE: pages export named components (no default). Map them to default for React.lazy.
const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })))
const EventsPage = lazy(() => import('../pages/EventsPage').then(m => ({ default: m.EventsPage })))
const EventDetails = lazy(() => import('../pages/EventDetails').then(m => ({ default: m.EventDetails })))
const Committee = lazy(() => import('../pages/Committee').then(m => ({ default: m.Committee })))
const FacultyPage = lazy(() => import('../pages/FacultyPage').then(m => ({ default: m.FacultyPage })))
const DevelopersPage = lazy(() => import('../pages/DevelopersPage').then(m => ({ default: m.DevelopersPage })))
const HackversePage = lazy(() => import('../pages/HackversePage').then(m => ({ default: m.HackversePage })))

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-600 dark:text-slate-300">Loading…</div>}>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/events' element={<EventsPage/>} />
        <Route path='/events/:eventYear/:eventId' element={<EventDetails/>} />
        <Route path='/committee' element={<Committee/>} />
        <Route path='/faculty' element={<FacultyPage/>} />
        <Route path='/devs' element={<DevelopersPage/>} />
        <Route path='/hackverse' element={<HackversePage/>} />
      </Routes>
    </Suspense>
  )
}