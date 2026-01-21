import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './reset.css'
import DiscussionGuide from './pages/DiscussionGuide.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DiscussionGuide />
  </StrictMode>,
)
