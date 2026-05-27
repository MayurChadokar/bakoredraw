
import React, { Component } from "react";
// import { Container , Alert} from "reactstrap";
import socketIOClient from "socket.io-client";
import ColorSelector from "./ColorSelector";
import Dots from 'react-activity/lib/Dots';
// import UserList from "./UserList";
import {isMobile,} from 'react-device-detect';
// In development you have to point the react front end explicitly to your express server which will be running on a different port than the React Dev Server

// Connect directly to the Node socket server
// For local dev, use http://localhost:4010
// For production, use the actual server URL via env var
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4010";
const socket = socketIOClient(SOCKET_URL, { 
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
// const socket = socketIOClient("https://santapp.syscraft-pro.tk:3000/"); //development;
//  const socket = socketIOClient("http://192.168.1.95:4010"); //development;
// In production, the express server will be the one to serve the react application so we can leave out the connection string argument, which will allow the socket to default to it origin (theoretically your express server)

// const socket = socketIOClient(); //production
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; 
export default class WhiteBoard extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      drawing: false,
      currentColor: "black",
      currentSize:'5',
      currentBoardColor:'white',
      windowHeight: window.innerHeight,
      windowWidth:/*isMobile ?((iOS) ? screen.width : window.innerWidth) :  600,*/ isMobile ? window.innerWidth : 600,  
      cleared: false,
      username: null,
      room: this.props.room,
      admin:this.props.admin,
      userList: [],
      loading:true,
      
      rerender:false
    };
   
  
    this.whiteboard = React.createRef();

    socket.emit("join", {
      id:'active@gmail.com' ,
      room: this.props.room,
      admin:this.props.admin
    });

    socket.on("joined", joined => {
      // console.log('white board join', joined)
      this.setState({
        id: joined.id,
        admin:joined.admin,
        room: joined.room
      });
    });

    socket.on("users", users => {
       console.log('users response from server', users)
      users.map((item, ind)=>{
        if(ind == 0 && item !== null){
          this.setState({
            currentSize:item.size,
            currentColor:item.color,
            currentBoardColor:item.boardColor

          })
          // document.body.style.backgroundColor = item.boardColor;
          
        var  viewport = document.querySelector("meta[name=theme-color]");
         viewport.setAttribute('content', item.boardColor);
        }
      })
      this.setState({
        userList: users
      });
    });
   
    socket.on("cleared", () => {
      this.drawData = []
      this.state.whiteboard
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
    });
    socket.on("drawing_eraseline", data => {
      let w = isMobile ? window.innerWidth : 600;
      let h = window.innerHeight;
      //console.log('socket clear line issue:', data)
      
      this.state.whiteboard
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.drawData = [...data];
        data.map((item)=>{
          
          if (item.room === this.state.room) {
           
            // console.log('data in if for erase', item)
            item.line.map((position) => {
               
              const prevposX = position.start.prevoffX * w;
              const prevposY = position.start.prevoffY * h;

              const offsetX = position.stop.offsetXX * w;
              const offsetY = position.stop.offsetYY * h
            
              this.drawLine(prevposX, prevposY,offsetX,offsetY, item.color, item.size);
              
            });
          } 
        })
        
     
    });
    socket.on("drawing", data => {
      let w = isMobile ? window.innerWidth : 600;
      let h = window.innerHeight;
      
      
      // console.log('my on emit recieve data', data)
      
      if (data.room === this.state.room) {
        this.drawData.push(data)
            data.line.map((position) => {
              
              const prevposX = position.start.prevoffX * w;
              const prevposY = position.start.prevoffY * h;

              const offsetX = position.stop.offsetXX * w;
              const offsetY = position.stop.offsetYY * h
                
                if (!isNaN(offsetX) && !isNaN(position.start.prevoffY)) {
              this.drawLine(prevposX, prevposY,offsetX,offsetY, data.color, data.size);
                }
             
            });
          }   
     
    });
  }
  prevPos = {offsetX:0, offsetY:0}
  line = []
  drawData = [];
  componentDidMount() {
    if(this.state.room)
    this.setState({
      whiteboard: this.whiteboard.current
    });
    this.whiteboard.current.style.height = window.innerHeight;
    this.whiteboard.current.style.width = isMobile ? window.innerWidth : 600;

    this.whiteboard.current.addEventListener(
      "mousedown",
      this.onMouseDown,
      false
    );
    this.whiteboard.current.addEventListener("mouseup", this.onMouseUp, false);
    this.whiteboard.current.addEventListener("mouseout", this.onMouseUp, false);
    this.whiteboard.current.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 5),
      false
    );

    this.whiteboard.current.addEventListener(
      "touchstart",
      this.onMouseDown,
      false
    );

    this.whiteboard.current.addEventListener(
      "touchmove",
      this.throttle(this.onTouchMove, 5),
      false
    );
    setTimeout(function(){
      this.setState({rerender:true});
 }.bind(this),100);  // wait 5 seconds, then reset to false
    this.whiteboard.current.addEventListener("touchend", this.onMouseUp, false);
    window.addEventListener('beforeunload', this.onBeforeUnload, false);
    window.addEventListener('load', this.onRefresh);
      
  
    window.addEventListener("resize", this.onResize);
    return () => window.removeEventListener("resize", this.onResize);
   
  }
  onRefresh = () =>{
   
     
    
    if(this.state.room)
    {
      // console.log('onrfresh in room', this.state.room)
      socket.emit('refresh', {room:this.state.room})
      //socket.emit('currentsize', {room:this.state.room})
    }
  }

   refreshPage =()=> {
    window.location.reload(false);
  }
  // onBeforeUnload = () =>{
  //   if(this.state.room)
  //   {
  //     // console.log('onunload is calling')
  //     socket.emit('unload', 
  //     {
  //       room:this.state.room, 
  //       size:this.state.currentSize,
  //       color:this.state.currentColor,
  //       boardColor:this.state.currentBoardColor
  //      })
      
  //   }
  // }
  drawLine = (prevX,prevY,currX, currY , color,size, emit, force) => {
    // console.log('online draw',prevX,prevY,currX, currY , color,size, emit, force)
    let offestX = currX;
    let offsetY = currY;
    let context = this.state.whiteboard.getContext("2d");
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(currX, currY );
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.shadowColor = color;
    context.shadowBlur = 2;
    // if (force) {
    // 	context.lineWidth = size * (force * (force + 3.75));
    // }
    context.stroke();
    context.closePath();
    this.prevPos = { offestX, offsetY };
    
  };

  onMouseDown = e => {
    
    const { offsetX, offsetY } = e;
    let width_undivided = window.innerWidth - 600
    let final_margin = width_undivided/2
    this.setState(() => {
      return {
        currentX:(isMobile ? e.clientX : e.clientX-final_margin ),
        currentY: e.clientY,
        drawing: true
      };
    
    });
    this.prevPos = { offsetX, offsetY } 
    
  };

  onMouseUp = e => {
    //console.log('on mouse up', e.clientX, e.clientY)
    this.setState(() => {
      return {
        drawing: false,
        currentX: e.clientX,
        currentY: e.clientY
      };
    });
    this.sendpaintData(true);
    
  };
 sendpaintData = (emit) =>{

 
  var w = window.innerWidth;
  var h = window.innerHeight;
  if(!emit){
    return;
  }
    this.setState(() => {
     
        socket.emit("drawing", {
         
          line:this.line,
          room: this.state.room,
          color:this.state.currentColor,
          size:this.state.currentSize
        });
      if(this.line.length > 0 ){
       this.drawData.push({line:this.line,
        room: this.state.room,
        color:this.state.currentColor,
        size:this.state.currentSize})
      }
    }
    );
    
    this.line = [];
 }


  onMouseMove = e => {
    if (!this.state.drawing) {
      return;
    }
    let width_undivided = window.innerWidth - 600
    let final_margin = width_undivided/2
   
    var { offsetX, offsetY } = e.clientX;
   var offsetX = e.clientX-final_margin
   var offsetY = e.clientY
    //console.log('onmousemove cordinates', offsetX, offsetY, e.clientX, e.clientY, this.state.currentX, this.state.currentY)
    // const offSetData = { offsetX, offsetY }
    var w = isMobile ? window.innerWidth : 600;
    var h = window.innerHeight;
    //for line to be send
    const offsetXX = offsetX / w;
    const offsetYY = offsetY / h;
    
    const prevoffX = this.state.currentX / w;
    const prevoffY =  this.state.currentY/ h
    // offsetdata to be sent for responsive drawing
    
    const offsetresponsive = {offsetXX, offsetYY}
    const prevposoffset = {prevoffX, prevoffY}
    const positionData = {
      start: { ...prevposoffset },
      stop: { ...offsetresponsive },
    };
    if (!isNaN(offsetXX)) {
     
    this.setState(() => {
      return {
        currentX: e.clientX-final_margin,
        currentY: e.clientY
      };
    }, this.drawLine(this.state.currentX , this.state.currentY,offsetX,offsetY, this.state.currentColor,this.state.currentSize,),
   
    this.line = this.line.concat(positionData)
    );
    }
    
  };
  
  onTouchMove = e => {
    if (!this.state.drawing) {
      return;
    }
    // console.log("My Touch",e.touches[0]);
    if(typeof(this.state.currentX)=='undefined' || typeof(this.state.currentY)=='undefined'){
      this.setState(() => {
      return {
          currentX: e.touches[0].clientX,
          currentY: e.touches[0].clientY
        };
      });  
    }
    

    var w = isMobile ? window.innerWidth : 600;
    var h = window.innerHeight;
    const offsetX = e.touches[0].clientX;
    const offsetY = e.touches[0].clientY;

    const offsetXX = offsetX / w;
    const offsetYY = offsetY / h;
    const prevoffX = this.state.currentX / w;
    const prevoffY =  this.state.currentY / h;
    
    const prevposoffset = {prevoffX, prevoffY}

    const offSetData = { offsetXX, offsetYY }
    const positionData = {
    start: { ...prevposoffset },
    stop: { ...offSetData },
    };
    // if (!isNaN(prevoffX)) {
    this.setState(() => {
     
      return {
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY
      };
    }, this.drawLine(
      this.state.currentX,
      this.state.currentY,
      offsetX,
      offsetY,
      this.state.currentColor,
      this.state.currentSize,
      false,
      e.touches[0].force
    ),
    this.line = this.line.concat(positionData)
    );
    
  };

  onResize = () => {
    // if(iOS || !isBrowser || !isSafari){
    //   this.refreshPage();
    // }
    // console.log('on resize', isMobile)
    setTimeout(()=>{
      this.setState({
        windowWidth: isMobile ? window.innerWidth : 600,
        windowHeight: window.innerHeight
      });
    }, 100)
      
   
    
      setTimeout(()=>{
        let w = this.state.windowWidth
      let h =this.state.windowHeight
      // console.log('on resize', w,h, this.drawData);
     
      this.state.whiteboard
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.drawData.map((item)=>{
          if (item.room === this.state.room) {
            // console.log('data in if for erase', item)
            item.line.map((position) => {
               
              const prevposX = position.start.prevoffX * w;
              const prevposY = position.start.prevoffY * h;

              const offsetX = position.stop.offsetXX * w;
              const offsetY = position.stop.offsetYY * h
            
              this.drawLine(prevposX, prevposY,offsetX,offsetY, item.color,item.size);
              
            });
          }
        })
      }, 150)
      
        
     
    
  };

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  selectColor = (value) => {
    // console.log('select color function', value)
    this.setState(() => {
      socket.emit("color-change", {
        id: this.state.id,
        username: this.state.username,
        admin:this.state.admin,
        room: this.state.room,
        color: value,
        boardColor:this.state.currentBoardColor,
        size:this.state.currentSize
      });
      return {
        currentColor:value
      };
    });
  };
  
  selectBoardColor = (value) => {
    // console.log('select color function', value)
    this.setState(() => {
      socket.emit("board-color-change", {
        id: this.state.id,
        username: this.state.username,
        boardColor:value,
        admin:this.state.admin,
        room: this.state.room,
        color: value,
        size:this.state.currentSize
      });
      return {
        currentBoardColor:value
      };
    });
  };
  selectPen = (inputName, value) => {
    // console.log('pen size',value)
    this.setState(() => {
      socket.emit("pen-change", {
        id: this.state.id,
        username: this.state.username,
        admin:this.state.admin,
        room: this.state.room,
        color:this.state.currentColor,
        boardColor:this.state.currentBoardColor,
        size:value
      });
      return {
        currentSize: value
      };

    });
    
  };
  clearBoard = (e) => {
    
    socket.emit("clear", this.state.room);
  };
  clearOneLine =(e)=>{
    // console.log('clear one line is calling')
    
    socket.emit("clearline", {room: this.state.room})
    
  }
  leave = () => {
    socket.emit("leaveroom", { id: this.state.id, room: this.state.room });
  };
  setting = () =>{
    // console.log('setting button click')
  }
  
  render() {
    // console.log('userlist', this.state.userList)
    let width_undivided = window.innerWidth - 600
    let final_margin = width_undivided/2
//     console.log('this room', this.state.room)
// console.log('userlist', this.state.userList)
    if(!this.state.room){
      return(
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Dots/>
        </div>
      )
    }else
    {
     return(
     
      <div style={{backgroundColor:'wheat',}}>
      {/* <h1 className="room-name">{this.state.room}</h1> */}
     <div style={{ justifyContent:'center',overflow: 'hidden' }}>
      <canvas
        height={`${this.state.windowHeight}px`}
        width={`${this.state.windowWidth}px`}
        ref={this.whiteboard}
        // className="whiteboard"
        // style = {{backgroundColor:this.state.currentBoardColor }}
        style={
  isMobile
    ? {
        backgroundColor: this.state.currentBoardColor,
        position: 'fixed',
        top: 0,
        left: 0,
      }
    : {
        backgroundColor: this.state.currentBoardColor,
        borderWidth: '1px',
        borderColor: 'black',
        border: '1px solid',
        position: 'fixed',
        top: 0,
        left: final_margin,
      }
}

        // style= {isMobile ? { backgroundColor:this.state.currentBoardColor, position:'fixed', top:0, left:0}:{ backgroundColor:this.state.currentBoardColor,borderWidth:'1px', borderColor:'black',border: '1px solid', position:'fixed', top:0, left:final_margin}}
      />
      {/* <UserList userList={this.state.userList} /> */}
     
      <ColorSelector
        clearBoard={this.clearBoard}
        clearOneLine = {this.clearOneLine}
        setting = {this.setting}
        currentColor={this.state.currentColor}
        currentBoardColor = {this.state.currentBoardColor}
        selectBoardColor = {this.selectBoardColor}
        selectColor={this.selectColor}
        currentSize = {this.state.currentSize}
        selectPen = {this.selectPen}
        leaveRoom={this.props.clearRoom}
        leave={this.leave}
        room ={this.state.room}
        admin = {this.props.admin}
        logout = {this.props.logout}
        onRefresh = {this.onRefresh, this.refreshPage}
        id= {this.state.id}
      />
      </div>
    </div>
     )
    }
    
      
        
      
    
  }
}
