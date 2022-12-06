// 提示，高级组件
import { Alert } from 'antd'

function DifferentAlert(type:'info' | 'success' | 'error' | 'warning',description:string){
  function Alerts() {
    return (
      <Alert
        message=""
        showIcon
        description={description}
        type={type}
      />
    )
  }
  return Alerts;
}

export default DifferentAlert;