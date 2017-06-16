var http = require('http');
var node_static = require('node-static')
var formidable = require('formidable');
var path = require('path');
var fs = require('fs')
var textract = require('textract');
var low = require('lowdb')
var supportedMethods= require('./supportedMethods.js')
var awsConc = require('./awsConc.js')

const db = low('db.json')


var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'Content-Type': 'application/json'
};
var static_files  = new node_static.Server(`${__dirname}/../client`);
var port = 3000;
var ip = '127.0.0.1'

//
db.defaults({ feeds: []}).write()

var server = http.createServer(function(req, res){
	if(req.method === 'GET') {
		if(req.url === '/'){
			req.url = req.url + '/index.html';
			static_files.serve(req, res);
			req.resume();  
		} else if(req.url === '/feeds') {
      res.writeHead(200);
      //retrive document feeds from database db.json
      res.end(JSON.stringify(db.get('feeds')));
    }else {
			res.writeHead(403);
			res.end('what are u doing here??!');
		}
	} else if(req.method === 'POST'){
		if(req.url === '/'){
      var form = new formidable.IncomingForm();
      form.multiples = false;
      form.uploadDir = path.join(__dirname, '/uploads');

      // every time a file has been uploaded successfully,
      // rename it to it's orignal name, read the file from uploads, extract stats, save to AWS bucket and save it on the feeds 'db.json'
      form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name), function(err) {
        	if(err) throw err
           textract.fromFileWithPath(`./uploads/${file.name}`, function( error, text ) { if(error) console.log(error)
             supportedMethods.getFrequency(text, (stats) => awsConc(stats, file.name.split('.')[0], (url) => {res.writeHead(200, headers);res.end(url);
             }));
           });
       });
      });

      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // parse the incoming request containing the form data
      form.parse(req);

    } else if( req.url === '/addfeed'){
      //ensure the data recived correctly than save them into database
      supportedMethods.collectData(req, data => {res.writeHead(200, headers);db.get('feeds').push(data).write(); res.end('success');});
    } else {
      res.writeHead(403, headers);
      res.end('what are u doing here??!');
  }
}



}).listen(port, ip);


console.log('Listening on http://' + ip + ':' + port);
