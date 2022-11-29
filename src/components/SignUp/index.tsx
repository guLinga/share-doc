import './index.scss'

function SignUp() {
  
  const Sign = () => {}

  const sendCode = () => {}

  return (
    <div className="Sign LoginSign">
      <input
        type="email"
        className="signIpt"
        placeholder="请输入邮箱"
      />
      <input
        type="password"
        className="signIpt"
        placeholder="请输入密码(大于六位数字)"
      />
      <input
        type="password"
        className="signIpt"
        placeholder="请确认密码(大于六位数字)"
      />
      {/* 验证码 */}
      <div className="verificationC">
        <input
          v-model="code"
          type="text"
          className="verification code signIpt"
          placeholder="请输入验证码"
        />
        <input
          onClick={sendCode}
          type="button"
          className="sendBtn code"
          value='获取验证码'
        />
      </div>
      {/* 注册 */}
      <input onClick={Sign} type="button" className="signBtn" value="注册" />
    </div>
  )
}

export default SignUp