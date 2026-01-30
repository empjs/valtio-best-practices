import {createRoot} from 'react-dom/client'

const App = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)
