import { Route, Routes, Navigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { userResult } from './store/user'
import LeftSelector from './components/LeftSelector'
import FilesManager from './pages/filesManager'
import Dairy from './pages/dairy'
import Sign from './pages/Sign'
import './app.scss';
import { useEffect } from 'react';
export default function App() {
  const user = useSelector(userResult);
  //刷新页面储存redux中的数据
  useEffect(()=>{
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('users', JSON.stringify(user));
    });
  })

  return (
    <>
      {/* token鉴权 */}
      {
        !user || !user.tokens ? <Sign /> : null
      }
      {
        !(!user || !user.tokens) ?
        <div className="App container-fluid">
          <div className='row view-flex'>
            <LeftSelector />
            <Routes>
              <Route element={ <FilesManager/> } path="/filesManager" />
              <Route element={ <Dairy/> } path="/index" />
              <Route path='/' element={<Navigate to="/index"/>} />
            </Routes>
          </div>
        </div> : null
      }
    </>
  )
}