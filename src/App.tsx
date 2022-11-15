import { Route, Routes } from 'react-router-dom'
import LeftSelector from './components/LeftSelector'
import FilesManager from './pages/filesManager'
import Dairy from './pages/dairy'
import './app.scss';
export default function App() {
  return (
    <div className="App container-fluid">
      <div className='row view-flex'>
        <LeftSelector />
        <Routes>
          <Route element={ <FilesManager/> } path="/filesManager" />
          <Route element={ <Dairy/> } path="/dairy" />
        </Routes>
      </div>
    </div>
  )
}