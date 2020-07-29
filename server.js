var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var crypto = require('crypto');
var express = require('express');
var bodyParser = require('body-parser');

var buffer = require('buffer');
var path = require('path');
var fs = require('fs');
var http = require('http');

const { response } = require('express');
const { decode } = require('punycode');

//Create Express Service
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('web_practice'));
app.use(express.static('bootstrap'));
app.use(express.static('moviegridview/'));
app.use(express.static('bootstrap2'));
app.use(express.static('/findall'));
app.use(express.static('/findimg'));
app.use(express.static('/register'));
app.use(express.static('/search'));
//Create MongoDB Client
var MongoClient = mongodb.MongoClient;

//Connection URL
var url = 'mongodb+srv://admin:madcamp@week2.ivjze.mongodb.net/week2nodejs?retryWrites=true&w=majority' // 27017 is default port
// var url = 'mongodb://localhost:27017'

MongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
  if (err){
    console.log('Unable to connect to the mongoDB server.Error', err);
  }
  else{

    // app.get('/download/:continent', (req, res) =>{
    //     // var post_data = request.body;
    //     var db = client.db('week2nodejs');
    //     var continent=req.query.continent;
    //     // var filename = path.join(__dirname,'/public/', email, '.jpeg');
    //     var filename = __dirname + '/public/' + continent + '.jpeg';

    //     console.log(continent);

    //     fs.readFile(filename,              //파일 읽기
    //     function (err, data)
    //     {
    //         //http의 헤더정보를 클라이언트쪽으로 출력
    //         //image/jpg : jpg 이미지 파일을 전송한다
    //         //write 로 보낼 내용을 입력
    //         res.writeHead(200, { "Context-Type": filename });//보낼 헤더를 만듬
    //         res.write(data);   //본문을 만들고
    //         res.end();  //클라이언트에게 응답을 전송한다
    //         console.log(res);

    //     }
    // );
    // })

    app.get('/search', (request, response) =>{
      var db = client.db('week2nodejs');
      var name=request.query.name;
      console.log(name);
      db.collection('movie').find({'name':name}).toArray(function(err, user){
        response.json(user);
      });
    });

    app.post('/register', function(req,res){
      console.log("$$$$$$$$$$$$$$$$$$$$$");
      console.log(req.body);
      console.log("@@@@@@@@@@@@@@@@@@@@@@");
      var email = req.body.email; 
      var name = req.body.name;
      var phone = req.body.phone;
      var password = req.body.password;
      var db = client.db('week2nodejs');
      db.collection('user').insertOne({"email":email, "password": password, "name":name,"phone":phone},function(err,data){
      res.json("Registration success");
      console.log("Registration success");
      });
    });

    app.get('/findall', (request, response) =>{
      var db = client.db('week2nodejs');
      var continent=request.query.continent;
      db.collection('movie').find({'continent':continent}).toArray(function(err, user){
        response.json(user);
      });
    });

    app.get('/findimg', (request, response) =>{
        var db = client.db('week2nodejs');
        var continent=request.query.continent;
        db.collection('continent').find({'name':continent}).toArray(function(err, user){
          response.json(user);
        });
      });


    app.get('/bootstrap/', (req, res) =>{
      // var post_data = request.body;
      // var email = req.params.email;
      // var filename = path.join(__dirname,'/public/', email, '.jpeg');
      var filename = __dirname + '/bootstrap/'+ 'index.html';


      fs.readFile(filename,              //파일 읽기
        function (err, data)
        {
            //http의 헤더정보를 클라이언트쪽으로 출력
            //image/jpg : jpg 이미지 파일을 전송한다
            //write 로 보낼 내용을 입력
            res.writeHead(200, { "Context-Type": filename });//보낼 헤더를 만듬
            res.write(data);   //본문을 만들고
            res.end();  //클라이언트에게 응답을 전송한다
            console.log(res);

        }
      );
    });

    app.get('/bootstrap2/', (req, res) =>{
      // var post_data = request.body;
      // var email = req.params.email;
      // var filename = path.join(__dirname,'/public/', email, '.jpeg');
      var filename = __dirname + '/bootstrap2/'+ 'index.html';

      var continent=req.query.continent;
      var movie=req.query.movie;


      fs.readFile(filename,              //파일 읽기
        function (err, data)
        {
            //http의 헤더정보를 클라이언트쪽으로 출력
            //image/jpg : jpg 이미지 파일을 전송한다
            //write 로 보낼 내용을 입력
            res.writeHead(200, { "Context-Type": filename });//보낼 헤더를 만듬
            res.send(continent);
            res.send(movie);
            res.write(data);   //본문을 만들고
            res.end();  //클라이언트에게 응답을 전송한다
            console.log(res);

        }
      );
    });

    app.listen(3000,()=> {
      console.log('Connected to MongoDB Server, WebService running on port 3000');
    });
}
});
      