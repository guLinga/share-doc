enum status {
  success = 200,
  error = 500
}

let leftDataList:any[] = [];
let rightDataList:any[] = [];

//录音
export class Audio{
  static instance:any;
  public mediaStreams:MediaStream | undefined;
  public jsNodes:ScriptProcessorNode | undefined;

  constructor(){}

  //初始化，单例模式
  static init():Audio{
    if(!this.instance){
      this.instance = new Audio();
    }
    return this.instance;
  }

  //获取麦克风权限
  recorder () {
    return new Promise<{code: status,msg: MediaStream}>((resolve,reject)=>{
      window.navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(mediaStream => {
        this.mediaStreams = mediaStream;
        resolve({
          code: status.success,
          msg: mediaStream
        });
      }).catch(err => {
          reject({
            code: status.error,
            msg: err
          })
      });
    })
  }

  //创建AudioContext，将获取麦克风权限的stream传递给AudioContext
  //并创建jsNode用来收集信息，将jsNode连接
  //开始录音，调用该函数，将recorder函数返回的msg传递进去
  beginRecord(mediaStream:MediaStream){
    let audioContext = new window.AudioContext;
    let mediaNode = audioContext.createMediaStreamSource(mediaStream);
    // 创建一个jsNode
    let jsNode = this.createJSNode(audioContext);
    this.jsNodes = jsNode;
    // 需要连到扬声器消费掉outputBuffer，process回调才能触发
    // 并且由于不给outputBuffer设置内容，所以扬声器不会播放出声音
    jsNode.connect(audioContext.destination);
    jsNode.onaudioprocess = this.onAudioProcess;
    // 把mediaNode连接到jsNode
    mediaNode.connect(jsNode);
  }

  //创建jsNode
  createJSNode (audioContext:AudioContext) {
    const BUFFER_SIZE = 4096;
    const INPUT_CHANNEL_COUNT = 2;
    const OUTPUT_CHANNEL_COUNT = 2;
    // createJavaScriptNode已被废弃
    //@ts-ignore
    let creator = audioContext.createScriptProcessor || audioContext.createJavaScriptNode;
    creator = creator.bind(audioContext);
    return creator(BUFFER_SIZE,INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
  }

  //收集录音信息，大概0.09s调用一次
  onAudioProcess (event:any) {
    let audioBuffer = event.inputBuffer;
    //左声道
    let leftChannelData = audioBuffer.getChannelData(0);
    //右声道
    let rightChannelData = audioBuffer.getChannelData(1);
    leftDataList.push([...leftChannelData]);
    rightDataList.push([...rightChannelData]);
  }

  //停止录音
  stopRecord () {
    //合并左右声道
    let leftData = this.mergeArray(leftDataList),
        rightData = this.mergeArray(rightDataList);
    //交叉合并左右声道
    let allData = this.interleaveLeftAndRight(leftData, rightData);
    let wavBuffer = this.createWavFile(allData);
    return this.playRecord(wavBuffer);
  }

  //返回src
  playRecord (arrayBuffer:ArrayBuffer) {
    let blob = new Blob([new Uint8Array(arrayBuffer)]);
    let blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  //合并左声道和右声道
  mergeArray (list:any[]) {
    let length = list.length * list[0].length;
    let data = new Float32Array(length),
        offset = 0;
    for (let i = 0; i < list.length; i++) {
        data.set(list[i], offset);
        offset += list[i].length;
    }
    return data;
  }

  //交叉合并左右声道
  interleaveLeftAndRight (left:Float32Array, right:Float32Array) {
    let totalLength = left.length + right.length;
    let data = new Float32Array(totalLength);
    for (let i = 0; i < left.length; i++) {
        let k = i * 2;
        data[k] = left[i];
        data[k + 1] = right[i];
    }
    return data;
  }

  //将PCM数据转换成wav
  createWavFile (audioData:Float32Array) {
    const WAV_HEAD_SIZE = 44;
    let buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE),
        view = new DataView(buffer);
    this.writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + audioData.length * 2, true);
    this.writeUTFBytes(view, 8, 'WAVE');
    this.writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 2, true);
    view.setUint16(32, 2 * 2, true);
    view.setUint16(34, 16, true);
    this.writeUTFBytes(view, 36, 'data');
    view.setUint32(40, audioData.length * 2, true);
  
    // 写入PCM数据
    let length = audioData.length;
    let index = 44;
    let volume = 1;
    for (let i = 0; i < length; i++) {
        view.setInt16(index, audioData[i] * (0x7FFF * volume), true);
        index += 2;
    }
    return buffer;
  }

  writeUTFBytes (view:DataView, offset:number, string:string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) { 
        view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

}