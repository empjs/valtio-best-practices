import {createRoot} from 'react-dom/client'

const App = () => {
  return <div>Hello World</div>
}
const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)
