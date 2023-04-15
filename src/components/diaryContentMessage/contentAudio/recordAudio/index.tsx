import React, { useState } from 'react';
import { Button } from 'antd';
import IconFont from '../../../Icon/index';
import { props } from './type'
import './index.scss'
import { useMediaRecorder } from '../../../../hooks/useMediaRecorder';
import { useRef, useEffect } from 'react';

export default React.memo(function RecordAudio({ closeMediaPop, addAudioList }: props) {
  // 录制暂停和恢复
  const [stop, setStop] = useState(true);
  // 录制完毕
  const [end, setEnd] = useState(true);
  // 音频可视化
  const canvas = useRef<HTMLCanvasElement>(null);
  // 录制前计数
  const [num, setNum] = useState<number>(3);
  // 录制音频hook
  const { mediaUrl, startRecord, resumeRecord, pauseRecord, stopRecord } = useMediaRecorder(canvas);

  // 三秒后开启录音
  useEffect(() => {
    let timer = setTimeout(() => {
      if (num > 0) {
        setNum(n => n - 1);
      } else if (num == 0) {
        setNum(n => n - 1);
        setEnd(true);
        startRecord();
      }
    }, 1000)
    return function () {
      clearTimeout(timer);
    }
  }, [num])

  return (
    <div className='recordAudioVessels'>
      <div className='recordAudio'>
        {
          end &&
          <div>
            {/* 音频可视化 */}
            <div className='audioFrame'>
              <div className='audioCanvas'>
                {
                  num === -1 ? <canvas ref={canvas}></canvas> : (num === 0 ? '开始' : num)
                }
              </div>
            </div>

            {/* 麦克风 */}
            <div className='microphone'>
              <IconFont type='icon-maikefeng' />
            </div>

            {/* 暂停和恢复 */}
            <div className='selector'>
              <div onClick={() => { if (num === -1) setStop(n => !n) }}>
                {
                  stop ? <IconFont type='icon-bofang' onClick={() => {
                    if (num === -1) pauseRecord();
                  }} /> : <IconFont type='icon-zanting' onClick={() => {
                    if (num == -1) resumeRecord();
                  }} />
                }
              </div>

              {/* 取消录制 */}
              <div>
                <Button onClick={() => {
                  stopRecord();
                  closeMediaPop();
                }}>取消</Button>
              </div>

              {/* 停止 */}
              <div className='termination'>
                <IconFont type='icon-tingzhi-copy' color='red' onClick={() => {
                  if (num == -1) {
                    stopRecord();
                    setEnd(false);
                  }
                }} />
              </div>

            </div>

          </div>
        }

        {
          !end &&
          <div>
            {/* 听音频 */}
            <div>
              <audio src={mediaUrl} controls></audio>
            </div>
            
            <div>
              <button onClick={() => {
                console.log(mediaUrl);
                addAudioList(mediaUrl)
                closeMediaPop();
              }}>保存</button>
              <button onClick={()=>{
                closeMediaPop();
              }}>
                取消
              </button>
            </div>

          </div>
        }
      </div>
    </div>
  )
})