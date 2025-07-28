const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../build`));
let onlineCount = 0;

let users = [];
let datas = [];

io.sockets.on("connection", (socket) => {
	let addedToList = false;
	let color;
	let room;
	let currentUsersInRoom;
	let removeline;
	let size;
	let currentsizeInRoom;
	let currentdata;
// console.log('datas', datas)

	socket.on("join", (join) => {
		if (addedToList) return;
		onlineCount++;
		join.id = onlineCount;
		addedToList = true;
		color = "black";
		size = '5'
		room = join.room;
		join.color = color;
		join.size = size;
		users.push(join);
		//users.push(size);
		socket.join(join.room);
		socket.userId = join.id;
		socket.emit("joined", join);
		currentUsersInRoom = users.filter((user) => {
			if (user.room === room) {
				return user;
			}
		});

		io.in(room).emit("users", currentUsersInRoom);
	});

	socket.on("drawing", (data) => {
		
		console.log('server drawing', data)
		console.log('data on server', datas)
		
		if(data.line.length > 0){
			socket.in(data.room).emit("drawing", data);
			datas.push(data);
		}
		
		//socket.in(data.room).emit("savedata", data);
	});
    socket.on("clearline", (data)=>{
		console.log('oneline is called', data.room)
		console.log("datas",datas);

		for(let i=0;i<datas.length;i++)
		{
			if(datas[i].room==data.room)
			{
				datas.pop();
				break;
			}
		}
		//let room  = data.room
		// removeline  =  datas.filter((user)=>{
		// 	console.log('data array room', user.room)
		// 	if(data.room == user.room){

				
		// 		console.log('lastitem',datas[datas.length - 1] )
		// 			  //lastItem = datas[datas.length - 1]
		// 			  datas.pop()
		// 			  return datas
		// 	}
		// })
		
		// removeline = datas.pop((data)=>{
		// 	if(data.room == room){
        //         return datas !== remove
		// 	}
		// })
		io.in(data.room).emit("drawing_eraseline", datas);
	})
	socket.on('refresh', (data)=>{
		console.log('refresh emit', data)
		currentdata = datas.filter((cdata)=>{
			if(data.room === cdata.room){
				return cdata
			}
		})
		io.in(data.room).emit('drawing_eraseline', currentdata)
	})
	socket.on("color-change", (data) => {
		currentUsersInRoom = users.filter((user) => {
			if (user.room === data.room) {
				if (user.id === data.id) {
					color = data.color;
					user.color = data.color;
				}
				return user;
			}
		});
		io.in(data.room).emit("users", currentUsersInRoom);
		io.in(data.room).emit("color", color);
	});
    
	socket.on("pen-change", (data) => {
		currentsizeInRoom = users.filter((user) => {
			if (user.room === data.room) {
				// if (user.id === data.id) {
					size = data.size;
					user.size = data.size
				// }
				console.log('socket size', size)
				return user;
			}
		});
		console.log('current size', currentsizeInRoom)
		io.in(data.room).emit("users", currentsizeInRoom);
		io.in(data.room).emit("size", size)
	});
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

	socket.on("clear", (clear) => {
		datas=[]
		io.in(clear).emit("cleared", clear);
	});
    
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
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/../build/index.html"));
});

const PORT = 4010;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
