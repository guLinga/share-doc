import { useRef, useState } from "react";

export const useMediaRecorder = (canvas:React.RefObject<HTMLCanvasElement>) => {
  
  const [mediaUrl, setMediaUrl] = useState<string>('');

  const mediaStream = useRef<MediaStream>();
  const mediaRecorder = useRef<MediaRecorder>();
  const mediaBlobs = useRef<Blob[]>([]);
  const audioCtx = useRef<AudioContext>();
  const [isDraw,setIsDraw] = useState(true);

  // 开始
  const startRecord = async () => {

    setIsDraw(true);

    // 读取输入流
    mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    // 生成 MediaRecorder 对象
    mediaRecorder.current = new MediaRecorder(mediaStream.current);
    
    audioCtx.current = new AudioContext();
    var analyser = audioCtx.current.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.fftSize;
    var dataArray = new Uint8Array(bufferLength);
    const source = audioCtx.current.createMediaStreamSource(mediaStream.current);
    source.connect(analyser);
    // analyser.connect(audioCtx.current.destination);
    
    const canvasCtx = canvas.current?.getContext("2d");
    function draw(){
      if(canvas.current===null||!isDraw)return;
      requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx!.fillStyle = 'rgb(13, 110, 253)';
      let canvasY = 60;
      let canvasX = 170;
      canvasCtx!.fillRect(0, 0, canvasX, canvasY);
      canvasCtx!.beginPath();
      canvasCtx!.lineWidth = 2;
      var sliceWidth = canvasX * 1.0 / bufferLength;
      var x = 0;
      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * canvasY/2;

        if(i === 0) {
          canvasCtx!.moveTo(x, y);
        } else {
          canvasCtx!.lineTo(x, y);
        }

        x += sliceWidth;
      }
      canvasCtx!.lineTo(canvas.current!.width, canvas.current!.height/2);
      canvasCtx!.stroke();

    }
    if(canvas.current!==null&&isDraw){
      draw();
    }

    // 将 stream 转换成 blob 存放
    mediaRecorder.current.ondataavailable = (blobEvent) => {
      mediaBlobs.current.push(blobEvent.data);
    }

    // 监听录音停止，生成预览的 blob url
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(mediaBlobs.current, { type: 'audio/wav' })
      console.log("blob",mediaBlobs.current,blob);
      
      const url = URL.createObjectURL(blob);
      setMediaUrl(url);
    }

    mediaRecorder.current?.start();
  }

  // 暂停
  const pauseRecord = async () => {
    mediaRecorder.current?.pause();
  }

  // 恢复
  const resumeRecord = async () => {
    mediaRecorder.current?.resume()
  }

  // 停止
  const stopRecord = async () => {
    if(mediaRecorder.current?.state !== 'inactive'){
      mediaRecorder.current?.stop()
      mediaStream.current?.getTracks().forEach((track) => track.stop());
      mediaBlobs.current = [];
      setIsDraw(false);
    }
  }

  return {
    mediaUrl,
    startRecord,
    pauseRecord,
    resumeRecord,
    stopRecord,
  }
}