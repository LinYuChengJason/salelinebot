var express = require('express'); //require為使用哪些模組
var mongodb = require('mongodb'); //使用模組mongodb
var linebot = require('linebot'); //使用模組linebot

var app = express(); //建立express實體，將express初始化，去NEW一個express，變數app才是重點。

var bot = linebot({
  "channelId": "1575984115",
  "channelSecret": "ad28f6c787e82e13f79b27eb2214c761",
  "channelAccessToken": "AwlymvJsyRL2CLokaZ0KCoLrf91l5FjUoiCztzM/UhI4bjSRnB/ZwMl3hGx8kMbSrQmIBDdMRvMJaDATddN4EJlll30VlV/LCXNimg1gy8GeoxAfTwrVYNQB3A5VOd548/W6JmFNcFQuTw8Xq8Ti8gdB04t89/1O/w1cDnyilFU="
}); 

var linebotParser = bot.parser();
app.post('/', linebotParser);

bot.on('message', function(event) {
  console.log(event.message.type);
  if (event.message.type == 'text') {
    let msg = event.message.text;
    if(msg.startsWith("stock")){
    	let msgAry = msg.split(' ');

    	// let str = "{$or:[";
    	// for(let i = 1; i < msgAry.length; i++){
    	// 	str += "{product:{$elemMatch:{type:" + msgAry[i] + "}}}"; 
    	// 	if(msg.length == 1 || i == msgAry.length - 1)
    	// 		continue;
    	// 	str += ",";
    	// }
    	// str += "]}";
		// console.log(str);

// {$or:[{product:{$elemMatch:{type:'JS1902-01'}}},{product:{$elemMatch:{type:'JS1902-77'}}}]}

    	find("salelinebot", {}, function(err, docs){
    		event.reply(JSON.stringify(docs)).then(function(data) {
		      // success 
		      console.log(docs);
		    }).catch(function(error) {	
		      // error 
		      console.log(error);
		    });
	    })
    	
    	// console.log("success")
    }else{
    	event.reply(msg).then(function(data) {
	      // success 
	      console.log(msg);
	    }).catch(function(error) {	
	      // error 
	      console.log(error);
	    });
    } 
  }
  else {
  	event.reply('?').then(function(data) {
      // success 
      console.log(msg);
    }).catch(function(error) {	
      // error 
      console.log('error');
    });
  }	
});

var mongodbURL =
'mongodb+srv://LinYuCheng:a0936662285@salelinebot-6uako.mongodb.net/test?retryWrites=true'; //將MongoDB的位置在Server程式碼中以一個變數儲存

var myDB; //建立一個全域變數myDB

mongodb.MongoClient.connect(mongodbURL, function(err, db){ //使用mongodb.MongoClient的方法connect()進行連線
	if(err){                                               //事件監聽器用在非同步程式碼，不確定何時會用到
		console.log(err);                                  //若回傳的參數有error，用console.log()印出錯誤內容
	} else{
		myDB = db.db("linebot");                                        //在mongoDB成功連線後，留住db物件
		console.log('connection success');                 //若沒有錯誤表示連線成功，印出connection success
	}
});

app.get('/broadcast', function(request, response){
	bot.broadcast('Broadcast!');

	response.status(200).send(JSON.stringify(ret));
	response.end();
})

function find(collection, query, callback){
	let collectionTarget = myDB.collection(collection);
	collectionTarget.find({"JS1902-01" : { $exists: true }}).project({"_id" : 0}).toArray(function(err, docs){
		callback(err, docs);
	});
}

function insert(collection,)
{
	let collectionTarget = myDB.collection(collection);
}

function update(collection, id, data, callback)
{
	let collectionTarget = myDB.collection(collection);
	collectionTarget.updateOne(
	 { client_id: id },
	 { $inc: { "size.uom": "cm", status: "P" },
	 $currentDate: { lastModified: true } })
	.then(function(result) {
	  // process result
	})
}


app.get('/find', function(request, response){
 	find("salelinebot", '{}', function(err, docs){
 		if(err)
 		{                                     
			response.status(200).send(docs);
			response.end();
		}
		else{                                      
			response.type('application/json');       
			response.status(200).send(docs);
			response.end();
		}
 	});
});

// app.get('/', function(request, response){ //app.get就是幫你做路由(分辨做哪種事情，類似事件監聽器 ex:新增資料、查詢資料、刪除資料、修改資料)。
// 	response.status(200).send('<html><body><H1>Hello World</H1></body></html>'); // 200為http通訊協定 表示連線成功
// 	response.end(); //end為回傳給使用者
// });

// app.get('/database', function(request, response){ //連接到/api/test才會做的事情，request帶有連接進來的資訊(參數)，response為回傳的內容。
// 	var collection = myDB.db("linebot").collection("salelinebot"); //使用myDB的方法collection('data')取得data這個collection
// 	collection.find({}).toArray(function(err, docs){ //使用collection的方法find()取得資料表內的內容，{}表示取得全部內容
// 		if(err){                                     //使用toArray()將資料轉成陣列，function的docs是轉成陣列後的結果
// 			response.status(406).end();              //轉陣列過程若有err，回傳給錯誤碼406，此為Http協定狀態碼      
// 		} else{                                      //.end()為將資料回傳給使用者
// 			response.type('application/json');       //沒有錯誤回傳狀態碼200並附帶著資料，因為MongoDB存的資料就是JSON，所以不用特別轉換
// 			response.status(200).send(docs);
// 			response.end();
// 		}
//    });	

app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000)); //啟動伺服器，聆聽port 5000。預設為80port，所以多半被別人佔走。IP:127.0.0.1:5000，domain:http://localhost:5000





