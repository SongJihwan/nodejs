var express = require('express');
var app = express();
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
 
app.listen(3100, function() {
	console.log('app listening on port 3100!');
});

app.get('/', function(req, res){
    res.end();
});

/* GET home page. */
app.post('/upload', function(req, res, next) {
  var form = new multiparty.Form();
  var soundData;
  var decodeData;
  var filename;
  // get field name & value
  form.on('field',function(name,value){
    console.log('normal field / name = '+name+' , value = '+value);
    if (name=='fname') {
 	  filename = value
    }
  });
  // file upload handling
  form.on('part',function(part){
      var size;
      if (part.filename) {
        size = part.byteCount;
      }else{
        part.resume();
     
      }    

      console.log("Write Streaming file :"+filename);
      var writeStream = fs.createWriteStream('C:/Users/Song/workspace/.metadata/.plugins/org.eclipse.wst.server.core/tmp8/wtpwebapps/codingM/upload/'+filename);
      writeStream.filename = filename;
      part.pipe(writeStream);

      part.on('data',function(chunk){
        console.log(filename+' read '+ chunk.length + 'bytes');
      });
     
      part.on('end',function(){
        console.log(filename+' Part read complete');
        writeStream.end();
      });
 });
  
  // all uploads are completed
  form.on('close',function(){
	res.status(200).send('Upload complete');
  });
  // track progress
  form.on('progress',function(byteRead,byteExpected){
    console.log(' Reading total  '+byteRead+'/'+byteExpected);
  });
 
  form.parse(req);
  res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
});
 
module.exports = router;