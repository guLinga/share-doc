import { useRef, useState } from 'react';
import { Audio } from '../../../utils/audio';

export default function ContentAudio() {

  const audioRef = useRef(null);

  const [audio,setAudio] = useState<Audio>();


  const startAudio = () => {
    (async function fn(){
      let audio = Audio.init();
      setAudio(audio);
      //获取麦克风权限
      let recorder = await audio.recorder();
      //开始录音
      audio.beginRecord(recorder.msg);
    })()
  }

  const stopAudio = () => {
    console.log('停止录音');
    let url = audio?.stopRecord();
    //@ts-ignore
    audioRef.current.src = url
  }

  return (
    <div>
      <audio ref={audioRef} src="" id="audio" controls autoPlay></audio>
      <button onClick={startAudio}>开始录音</button>
      <button onClick={stopAudio}>结束录音</button>
    </div>
  )
}
