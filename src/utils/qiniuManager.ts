const qiniu = window.require('qiniu');

export class QiniuManager{

  public mac;
  public bucket;
  public config;
  public bucketManager;
  public publicBuckerDomain = false;

  constructor(accessKey: string, secretKey: string, bucket: string){
    this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    this.bucket = bucket;

    this.config = new qiniu.conf.Config();
    this.config.zone = qiniu.zone.Zone_z2;

    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }
  //文件上传
  uploadFile(key:string, localFilePath:string){
    var options = {
      scope: this.bucket + ":" + key,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(this.mac);
    var formUploader = new qiniu.form_up.FormUploader(this.config);
    var putExtra = new qiniu.form_up.PutExtra();

    //文件上传
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, localFilePath, putExtra, this._handleCallback(resolve,reject));
    })
  }

  //文件删除
  deleteFile(key:string){
    return new Promise((resolve,reject) => {
      this.bucketManager.delete(this.bucket, key, this._handleCallback(resolve,reject));
    })
  }

  //获取bucketDomain连接
  async generateDownloadLink(key:string){
    const domainPromise = this.publicBuckerDomain ?
    Promise.resolve([this.publicBuckerDomain]) : this.getBucketDomain();

    return domainPromise.then(data => {
      if(Array.isArray(data) && data.length > 0){
        const pattern = /^https?/;
        this.publicBuckerDomain = pattern.test(data[0]) ? data[0] : `http://${data[0]}`;
        return this.bucketManager.publicDownloadUrl(this.publicBuckerDomain, key);
      }else{
        throw Error('域名未找到，请查看储存空间是否过期');
      }
    })
  }

  //获得bucketDomain
  getBucketDomain(){
    const reqUrl = `http://api.qiniu.com/v6/domain/list?tbl=${this.bucket}`;
    const digest = qiniu.util.generateAccessToken(this.mac, reqUrl);
    return new Promise((resolve, reject) => {
      qiniu.rpc.postWithoutForm(reqUrl, digest, this._handleCallback(resolve, reject));
    })
  }

  //公用方法
  _handleCallback(resolve:(value: unknown) => void,reject:(reason?: any) => void) {
    return function(respErr:Error,respBody:any,respInfo:any){
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        resolve(respBody);
      } else {
        reject({
          statusCode: respInfo.statusCode,
          body: respBody
        })
      }
    }
  }
}