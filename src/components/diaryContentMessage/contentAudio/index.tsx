import { useEffect, useRef } from 'react';
import { Audio } from '../../../utils/audio';

export default function ContentAudio() {

  const audioRef = useRef(null);

  useEffect(() => {
    (async function fn(){
      let audio = Audio.init();
      //获取麦克风权限
      let recorder = await audio.recorder();
      //开始录音
      audio.beginRecord(recorder.msg);
      setTimeout(()=>{
        console.log('停止录音');
        let url = audio.stopRecord();
        //@ts-ignore
        audioRef.current.src = url
      },1000)
    })()
  }, [])
  return (
    <div>
      <audio ref={audioRef} src="" id="audio" controls autoPlay></audio>
    </div>
  )
}
