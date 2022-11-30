import './index.scss'
import {useState} from 'react';

function SignIn() {
  
  // 用户名
  const [name,setName] = useState('');
  // 密码
  const [password,setPassword] = useState('');

  const login = () => {}

  return (
    <div id="Login">
      <div className="Login LoginSign">
        <input
          type="name"
          className="loginIpt"
          placeholder="请输入用户名"
          value={name}
          onChange={(e)=>{setName(e.target.value)}}
        />
        <input
          type="password"
          className="loginIpt"
          placeholder="请输入密码"
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
        />
        <a className="forget" href="">忘记密码？</a>
        <input onClick={login} type="button" className="loginBtn" value="登录" />
      </div>
    </div>
  )
}

export default SignIn