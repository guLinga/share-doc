const qiniu = require('qiniu');

const accessKey = 'CcSYaGFRIQPgTJOaQ3osV9sYcnJ0tQxLpdF2iQ8X';
const secretKey = 'iiM2wuOWfjxhA9hhoX_xaDCsR0YKz9jWbJXZidUp';

var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
  scope: 'xsx1514',
};

var putPolicy = new qiniu.rs.PutPolicy(options);

var uploadToken=putPolicy.uploadToken(mac);

var config = new qiniu.conf.Config();

config.zone = qiniu.zone.Zone_z2;

var localFile = "./README.md";
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var key='1.md';
// 文件上传
// formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
//   respBody, respInfo) {
//   if (respErr) {
//     throw respErr;
//   }
//   if (respInfo.statusCode == 200) {

//   } else {

//   }
// });

//文件下载
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var publicBucketDomain = 'http://rl0t7sh9i.hn-bkt.clouddn.com';
// 公开空间访问链接
var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);