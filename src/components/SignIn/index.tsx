import './index.scss'

function SignIn() {
  
  const login = () => {}

  return (
    <div id="Login">
      <div className="Login LoginSign">
        <input
          type="email"
          className="loginIpt"
          placeholder="请输入邮箱"
        />
        <input
          type="password"
          className="loginIpt"
          placeholder="请输入密码"
        />
        <a className="forget" href="">忘记密码？</a>
        <input onClick={login} type="button" className="loginBtn" value="登录" />
      </div>
    </div>
  )
}

export default SignIn