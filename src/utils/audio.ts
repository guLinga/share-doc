//获取麦克风权限
export const getUserMedia = () => {
  //@ts-ignore
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  //@ts-ignore
  navigator.getUserMedia({ 
    audio: true   // 这里面有video 和 audio 两个参数，视频选择video
  }, (stream:any) => {
    console.log(stream);
  }, (error:Error) => {
    console.log(error)
  })
}
export {}