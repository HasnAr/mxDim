 var AWS = require('aws-sdk');

AWS.config.loadFromPath('./configAWS.json');

s3 = new AWS.S3({apiVersion: '2006-03-01'});


module.exports  = function(stats, subject, callback){
	//console.log(subject)
    s3.upload ({Bucket: 'textstate' ,Key: subject, Body:stats}, function (err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload to AWS Success");
  }
});




	var urlParams = {Bucket: 'textstate', Key: subject, Expires: 604800 };
	s3.getSignedUrl('getObject', urlParams, function(err, url){
      callback(url);
	})

}







