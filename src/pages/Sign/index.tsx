import './index.scss'
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';

function Sgin() {

  return (
    <div id="LoginSign">
      <div className="content">
        <div className="middleContainer">
          <h1>penfriend-diary</h1>
          <div className="container">
            <div className="heard">
              <Link to={'/index'} className="login">登录</Link>
              <div className="line">|</div>
              <Link to={'/signup'} className="login">注册</Link>
            </div>
            <Routes>
              <Route element={ <SignIn/> } path="/index" />
              <Route element={ <SignUp/> } path="/signup" />
              <Route path="/"  element={ <Navigate to="/index"/> } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sgin