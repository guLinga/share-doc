import {useCallback, useState} from 'react';
import RecordAudio from './recordAudio'
import { Button } from 'antd'
import './index.scss'
export default function ContentAudio() {
  // 录制弹窗
  const [mediaPop,setMediaPop] = useState(false);
  // 储存录制的音频
  const [audioList, setAudioList] = useState<string[]>([]);
  const closeMediaPop = useCallback(()=>{
    setMediaPop(false);
  },[])
  const addAudioList = useCallback((url:string)=>{
    setAudioList(n=>{
      return [...n,url]
    });
  },[])

  return (
    <>
      <div className='mediaVessels'>
        <Button block onClick={()=>{setMediaPop(true)}} className="recordBtn">
          录制音频
        </Button>
        {
          audioList.map((item,idx)=>{
            return <audio key={idx} src={item} controls></audio>
          })
        }
        {
          mediaPop && <RecordAudio closeMediaPop={closeMediaPop} addAudioList={addAudioList} />
        }
      </div>
    </>
  )
}
