import './index.scss'
import { Link, Route, Routes } from 'react-router-dom';
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
              <Link to={'/signin'} className="login">登录</Link>
              <div className="line">|</div>
              <Link to={'/signup'} className="login">注册</Link>
            </div>
            <Routes>
              <Route element={ <SignIn/> } path="/signin" />
              <Route element={ <SignUp/> } path="/signup" />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sgin