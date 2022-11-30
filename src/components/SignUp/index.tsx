import './index.scss'
import axios from '../../utils/axios';
import {useState} from 'react';
import { message } from 'antd';
import { valueNotEmpty, emailRightful } from '.';
import {useNavigate} from 'react-router-dom'

function SignUp() {
  
  // 用户名
  const [name,setName] = useState('');
  // 邮箱
  const [email,setEmail] = useState('');
  // 密码
  const [password,setPassword] = useState('');
  // 重复密码
  const [repassword,setRepassword] = useState('');
  // 验证码
  const [code,setCode] = useState('');
  //倒计时
  const [count,setCount] = useState('获取验证码');

  const navigate = useNavigate();


  // 注册
  const SignUp = async () => {
    const temp = valueNotEmpty(name,email,password,repassword,code);
    if(!temp.is)return message.error(temp.msg);
    let result = await axios({
      url: '/users',
      method: 'POST',
      data:{name,password,email,code}
    })
    if(result.data.code===200){
      message.success('注册成功');
      navigate('/signin');
    }
    else message.error(result.data.msg);
  }


  // 获取验证码
  const sendCode = async () => {
    const temp = emailRightful(email);
    if(!temp.is)return message.error(temp.msg);
    let result = await axios({
      url: '/users/code',
      params: {
        email: '2634917964@qq.com'
      }
    })
    if(result.data.code===200)message.success('验证码发送成功');
    else message.error(result.data.msg);
  }


  return (
    <div className="Sign LoginSign">
      <input
        type="name"
        className="signIpt"
        placeholder="请输入用户名"
        value={name}
        onChange={(e)=>{setName(e.target.value)}}
      />
      <input
        type="email"
        className="signIpt"
        placeholder="请输入邮箱"
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
      />
      <input
        type="password"
        className="signIpt"
        placeholder="请输入密码(大于六位数字)"
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}
      />
      <input
        type="password"
        className="signIpt"
        placeholder="请确认密码(大于六位数字)"
        value={repassword}
        onChange={(e)=>{setRepassword(e.target.value)}}
      />
      {/* 验证码 */}
      <div className="verificationC">
        <input
          v-model="code"
          type="text"
          className="verification code signIpt"
          placeholder="请输入验证码"
          value={code}
          onChange={(e)=>{setCode(e.target.value)}}
        />
        <input
          onClick={sendCode}
          type="button"
          className="sendBtn code"
          value={count}
        />
      </div>
      {/* 注册 */}
      <input onClick={SignUp} type="button" className="signBtn" value="注册" />
    </div>
  )
}

export default SignUp