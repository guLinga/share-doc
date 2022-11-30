import { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { message } from 'antd';
import {useNavigate} from 'react-router-dom'
import { setUser } from '../../store/user';
import { valueNotEmpty } from './signIn';
import axios from '../../utils/axios';
import './index.scss';

function SignIn() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 用户名
  const [name,setName] = useState('');
  // 密码
  const [password,setPassword] = useState('');

  const login = async () => {
    const temp = valueNotEmpty(name,password);
    if(!temp.is)return message.error(temp.msg);
    let result = await axios({
      url:'/users/login',
      params: {
        name,password
      }
    })

    if(result.data.code===200){
      message.success("登录成功");
      dispatch(setUser(result.data));
    }else{
      message.error(result.data.msg);
    }
  }

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