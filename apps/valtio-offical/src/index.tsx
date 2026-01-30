import './style.css'
import {createRoot} from 'react-dom/client'
import {Router} from 'wouter'
import App from './App'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(
  <Router>
    <App />
  </Router>,
)
