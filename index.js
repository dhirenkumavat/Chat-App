// io needs to use HTTP, express will still be the middleware for routes
const express =require ('express')
const app = express(); //creates the express app
const httpserver = require('http').createServer(app); //app is an http server
const io = require('socket.io')(httpserver);

const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"))
var users = [];
var onlineuser =[];

app.get('',(req,res)=>{
    res.render('index');
});

io.sockets.on("connection",function(socket){
	users.push(socket);
	//console.log("New user connected "+users.length),

	socket.on("disconnect",function(){
		users.splice(users.indexOf(socket),1);
		onlineuser.splice(onlineuser.indexOf(socket.username),1);
		//console.log("User disconnected "+users.length);
	});

	socket.on("new user",function(data){
		socket.username = data;
		onlineuser.push(socket.username);
		//console.log("user conected "+socket.username);
		updateuser();
	});

	socket.on("msg",function(name,msg){
		io.sockets.emit("rmsg",{name:name,msg:msg});
	});

	function updateuser(){
		io.sockets.emit("get user",onlineuser);
	}

});
// http server listening on port
httpserver.listen(port, function(){
    console.log('listening on *:'+ port);
  });