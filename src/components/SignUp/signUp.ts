// 点击注册，判断所有输入框是否填写，两次密码是否一致
export const valueNotEmpty = (name:string,email:string,password:string,repassword:string,code:string) => {
  if(!name)return {is:false,msg:'用户名不能为空'};
  if(!(name.trim().length>=3&&name.trim().length<=18))return {is:false,msg:'用户名为3~18位数'};
  if(!email)return {is:false,msg:'邮箱不能为空'};
  if(!emailEgx.test(email))return {is:false,msg:'邮箱格式不正确'};
  if(!password)return {is:false,msg:'密码不能为空'};
  if(!(password.trim().length>=6&&password.trim().length<=18))return {is:false,msg:'密码为6~18位数'};
  if(!repassword)return {is:false,msg:'确认密码不能为空'};
  if(!(repassword.trim().length>=6&&repassword.trim().length<=18))return {is:false,msg:'确认密码为6~18位数'};
  if(password!==repassword)return {is:false,msg:'两次密码不相同'};
  if(!code)return {is:false,msg:'验证码不能为空'};
  return {is:true}
}

// 验证邮箱的正则表达式
const emailEgx = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

// 验证邮箱是否合法
export const emailRightful = (email:string) => {
  if(!email)return {is:false,msg:'邮箱不能为空'};
  if (!emailEgx.test(email))return {is:false,msg:'邮箱不合法'};
  return {is:true}
}