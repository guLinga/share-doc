import { Route, Routes } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { userResult } from './store/user'
import LeftSelector from './components/LeftSelector'
import FilesManager from './pages/filesManager'
import Dairy from './pages/dairy'
import Sgin from './pages/Sign'
import './app.scss';
export default function App() {
  const user = useSelector(userResult);
  return (
    <>
      {
        !user || !user.id ? 
          <Sgin />
        :
        <div className="App container-fluid">
          <div className='row view-flex'>
            <LeftSelector />
            <Routes>
              <Route element={ <FilesManager/> } path="/filesManager" />
              <Route element={ <Dairy/> } path="/dairy" />
            </Routes>
          </div>
        </div>
      }
      
    </>
  )
}