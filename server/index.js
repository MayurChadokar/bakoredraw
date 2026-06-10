const express = require("express");
const cors = require('cors')
const app = express();
const server = require("http").createServer(app);
// const io = require("socket.io")(server);
// var io = require("socket.io")(server, {
//   cors: {
    // origin: [
    //   "http://localhost:3000",
    //   "https://bakoredraw.syscraftonline.net"
    // ],
    // methods: ["GET", "POST"],
    // credentials: true
//   }
// });
var io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://bakoredraw.syscraftonline.net",
      "https://bakoredraw.com",
      "https://www.bakoredraw.com",
      "https://draw.bakoredraw.com",
      "https://bakoredraw.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"] // ensures fallback for browsers that don't handle WS
});

const bodyParser = require("body-parser");
const axios = require("axios");
app.use(cors())
app.use(bodyParser.json());

// Proxy endpoint to bypass CORS
app.get("/api/check_user", async (req, res) => {
	try {
		const { email, accesskey } = req.query;
		const apiUrl = `https://draw.bakoredraw.com/draw/wp-admin/admin-ajax.php?action=check_user&email=${email}&accesskey=${accesskey}`;
		
		// Add browser headers to bypass Cloudflare's bot protection which blocks Render
		const response = await axios.get(apiUrl, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
				"Accept": "application/json, text/plain, */*",
				"Accept-Language": "en-US,en;q=0.9"
			}
		});
		res.send(response.data);
	} catch (error) {
		console.error("Proxy Error:", error.message);
		res.status(500).json({ success: "0", error: "Proxy request failed" });
	}
});
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../build`));
let onlineCount = 0;

let users = [];
let datas = [];

io.sockets.on("connection", (socket) => {
	let addedToList = false;
	let color;
	let boardColor;
	let room;
	let currentUsersInRoom;
	let removeline;
	let size;
	let currentsizeInRoom;
	let currentdata;
	let authbody;
// console.log('datas', datas)

	socket.on("join", (join) => {
		// console.log('join is calling', join)
		// console.log('join is calling Users', users)
		if (addedToList) return;
		if(join.id){
			id = join.id;
		}else if(join.id == null){
			// console.log('new join if calling')
			onlineCount++;
			id = onlineCount
		}
		
		addedToList = true;
		color = "black";
		size = '5';
		boardColor = 'white';
		//console.log('user before filter', users)
		var userdata=users.find((user) => user.room == join.room);
		//console.log("Userdata",userdata);
		if(userdata) 
		{
        color = userdata.color;
        size = userdata.size;
        boardColor = userdata.boardColor;
		}

		room = join.room;
		join.color = color;
		join.size = size;
		join.boardColor = boardColor;
		join.id = id
		users.push(join);
		//var join1=Object.assign(join);
		var join1={...join};
		join1.id="info@info.com";
		users.push(join1);
//		users=removeDuplicates(users,"info@info.com");

	users=Array.from(new Set(users.map(JSON.stringify))).map(JSON.parse)
	//users.push(size);
		socket.join(join.room);
		// Send existing drawing data to the user who just joined
		const currentDataForRoom = datas.filter((d) => d.room === join.room);
		if (currentDataForRoom && currentDataForRoom.length) {
			socket.emit("drawing_eraseline", currentDataForRoom);
		}

		socket.userId = join.id;
		socket.emit("joined", join);
		// console.log('users in join')
		currentUsersInRoom = users.filter((user) => {
			if (user.room === room) {
				return user;
			}
		});
       
		io.in(room).emit("users", currentUsersInRoom);
	});




	// socket.on("drawing", (data) => {
		
	// 	console.log('server drawing', data)
	// 	console.log('data on server', datas)
		
	// 	if(data.line.length > 0){
	// 		socket.in(data.room).emit("drawing", data);
	// 		datas.push(data);
	// 	}
		
	// 	//socket.in(data.room).emit("savedata", data);
	// });
	// Persist incoming drawing data and broadcast to other clients in the room
	socket.on("drawing", (data) => {
		if (data && data.line && data.line.length > 0) {
			datas.push(data);
		}
		// send to all except the sender
		socket.broadcast.to(data.room).emit("drawing", data);

	});

    socket.on("clearline", (data)=>{

		 l = datas.length;
		 while (l--) {
			if (datas[l].room === data.room) {
				break;
			}
		}
		datas.splice(l, 1);
		
		
		currentdata = datas.filter((cdata)=>{
			if(data.room === cdata.room){
				return cdata
			}
		})
		
		
		// console.log("datas",datas);
		io.in(data.room).emit("drawing_eraseline", currentdata);
		
	})
	socket.on('refresh', (data)=>{
		console.log('refresh emit', data)
		currentdata = datas.filter((cdata)=>{
			if(data.room === cdata.room){
				return cdata
			}
		})
		//console.log('refresh usrers', users, data)
		currentUsersInRoom = users.filter((user)=>{
			console.log('onrefresh user', user)
			if(user.room === data.room){
				return user
			}
		})
		 console.log('onrefresh the data is', currentUsersInRoom)
		io.in(data.room).emit('drawing_eraseline', currentdata)
		io.in(data.room).emit('users', currentUsersInRoom)
	})
	// socket.on('unload', (data)=>{
	// 	console.log('unload is calling', data)
	// 	currentUsersInRoom = users.filter((user)=>{
	// 		if(user.room === data.room){
	// 			user.size = data.size;
	// 			user.color = data.color;
	// 			user.boardColor = data.boardColor;
	// 		}
	// 	})
	// })
	socket.on("color-change", (data) => {
		currentUsersInRoom = users.filter((user) => {
			if (user.room === data.room) {
				// if (user.id === data.id) {
					color = data.color;
					user.color = data.color;
				//}
				return user;
			}
		});
		// console.log('users on coloe=rchange', currentUsersInRoom)
		io.in(data.room).emit("users", currentUsersInRoom);
		//io.in(data.room).emit("color", color);
	});
    socket.on("board-color-change", (data) => {
		currentUsersInRoom = users.filter((user) => {
			if (user.room === data.room) {
				// if (user.id === data.id) {
					boardColor = data.boardColor;
					user.boardColor = data.boardColor;
				//}
				return user;
			}
		});
		// console.log('users on boardcoloerchange', currentUsersInRoom)
		io.in(data.room).emit("users", currentUsersInRoom);
		//io.in(data.room).emit("board_color", boardColor);
	});
	socket.on("pen-change", (data) => {
		currentUsersInRoom = users.filter((user) => {
			if (user.room === data.room) {
				// if (user.id === data.id) {
					size = data.size;
					user.size = data.size
				// }
				console.log('socket size', size)
				return user;
			}
		});
		// console.log('users on pen chnge', currentUsersInRoom)
		io.in(data.room).emit("users", currentUsersInRoom);
		//io.in(data.room).emit("size", size)
	});
	// socket.on("currentsize", (data) => {
	// 	currentsizeInRoom = users.filter((user) => {
	// 		if (user.room === data.room) {
	// 			// if (user.id === data.id) {
	// 				size = user.size;
	// 				//user.size = data.size
	// 			// }
	// 			console.log('socket size', size)
	// 			return user;
	// 		}
	// 	});
	// 	console.log('current size', currentsizeInRoom)
	
	// 	io.in(data.room).emit("size", size)
	// });
	socket.on("leaveroom", (data) => {
		addedToList = false;
		users = users.filter((user) => {
			if (user.id !== socket.userId) {
				return user;
			}
		});
		let currentUsersInThisRoom = users.filter((user) => {
			if (user.room === data.room) {
				if (user.id !== socket.userId) {
					return user;
				}
			}
		});
		currentUsersInRoom = [];
		io.in(data.room).emit("users", currentUsersInThisRoom);
	});

	// socket.on("clear", (clear) => {
	// 	console.log('clear', clear)
	// 	datas=[]
	// 	io.in(clear).emit("cleared", clear);
	// });
	socket.on('clear', (clear) =>{
		for( var i = 0; i < datas.length; i++){ 
                                   
			if ( datas[i].room === clear) { 
				datas.splice(i, 1); 
				i--; 
			}
		}
		io.in(clear).emit("cleared", clear);
	})
    
	socket.on("disconnect", () => {
		addedToList = false;

		users = users.filter((user) => {
			if (user.id !== socket.userId) {
				return user;
			}
		});

		currentUsersInRoom = users.filter((user) => {
			if (user.room === room) {
				return user;
			}
		});

		io.in(room).emit("users", currentUsersInRoom);
	});
});


const path = require("path");
const { response } = require("express");

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/../build/index.html"));
});
console.log("Registering route: *");


const PORT = 4010;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));