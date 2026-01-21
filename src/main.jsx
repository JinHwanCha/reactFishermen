import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import DiscussionGuide from './pages/DiscussionGuide.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/discussion-guide" element={<DiscussionGuide />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
