// 判断用户名和密码是否填写，格式是否正确
export const valueNotEmpty = (name:string,password:string) => {
  if(!name)return {is:false,msg:'用户名不能为空'};
  if(!(name.trim().length>=3&&name.trim().length<=18))return {is:false,msg:'用户名为3~18位数'};
  if(!password)return {is:false,msg:'密码不能为空'};
  if(!(password.trim().length>=6&&password.trim().length<=18))return {is:false,msg:'密码为6~18位数'};
  return {is:true}
}