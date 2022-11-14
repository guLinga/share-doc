import { Route, Routes } from 'react-router-dom'
import LeftSelector from './components/LeftSelector'
import FilesManager from './pages/filesManager'
import Test from './pages/test'
import './app.scss';
export default function App() {
  return (
    <div className="App container-fluid">
      <div className='row view-flex'>
        <LeftSelector />
        <Routes>
          <Route element={ <FilesManager/> } path="/filesManager" />
          <Route element={ <Test/> } path="/test" />
        </Routes>
      </div>
    </div>
  )
}