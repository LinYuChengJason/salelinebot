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
  // console.log(event.message.type);
  if (event.message.type == 'text') {
    let r_msg = event.message.text.toUpperCase();
    console.log("Recieved Msg with Upper latter: " + r_msg);
    if(r_msg.startsWith("?")){
    	let msgAry = r_msg.split(' ');
    	console.log(msgAry);

    	let msg = "商品庫存如下:\n";
    	
    	for(let i = 1; i < msgAry.length; i++)
    	{
    		let msgAry1 = msgAry[i].split('-');
    		console.log("Model %d: %s", i, msgAry1);

    		let is_msg_contain_submodel;
    		if(msgAry1.length == 1){
    			is_msg_contain_submodel = false;
    		}else{
    			is_msg_contain_submodel = true;
    		}

    		find("stock", {"model" : msgAry1[0]}, {_id : false}, function(err, docs){
	    		console.dir(docs);

	    		if(docs == null || docs.length == 0 || docs[0] == {}){
	    			msg = "查無此型號!";
	    		}else{
	    			let model = docs[0].model;
		    		let subModel = docs[0].submodel;
		    		let update_time = docs[0].update_time;
		    	
			    	if(!is_msg_contain_submodel && subModel.length == 1 && subModel[0].type === ""){
			    		//case 3
			    		msg += model + " " + subModel[0].name + ' -> ' + subModel[0].inventory + '\n';
			    	}else{
			    		let condition = !is_msg_contain_submodel; //check case 1 or 2
			    		for(let i of subModel)
				    	{
				    		let type = i.type;
				    		let name = i.name;
				    		let inventory = i.inventory;

				    		if(condition || type === msgAry1[1])
				    			msg += model + '-' + type + " " + name + ' -> ' + inventory + '\n';
				    		else
				    			continue;
				    	}
			    	}
			    	msg += '\n最後更新時間: ' + update_time;
	    		}

	    		console.log("final msg %s", msg);
	    		event.reply(msg).then(function(data) {
			      // success 
			      console.log(msg);
			    }).catch(function(error) {	
			      // error 
			      console.log(error);
			    });
		    	
		    });
    	}
    	// console.log("success")
    }else{
    	event.reply(r_msg).then(function(data) {
	      // success 
	      console.log(r_msg);
	    }).catch(function(error) {	
	      // error 
	      console.log(error);
	    });
    } 
  }
  else {
  	event.reply('?').then(function(data) {
      // success 
      console.log(r_msg);
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
	bot.broadcast('洗完澡就出門!');

	response.status(200).send();
	response.end();
})

function find(collection, query, filter, callback){
	let collectionTarget = myDB.collection(collection);
	collectionTarget.find(query).project(filter).toArray(function(err, docs){
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
 	find("stock", '{}', function(err, docs){
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





