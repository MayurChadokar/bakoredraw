import React, { Component } from "react";
import WhiteBoard from "./components/WhiteBoard";
import axios from 'axios';
import Choose from "./components/Choose";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss";
import "./components/style.css"
import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';


var email = ''
var room = ''

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			typingEmail: "",
			room: "",
			typingRoom: "",
			admin:'',
			loading:true, 
			authResponse:'',
			error:false, 
			user:'',
			errorText:'',
			id:''
		};
		// socket.on("joined", joined => {
		// 	console.log('joined rsponse', joined)
		// 	this.setState({
		// 	  id: joined.id,
		// 	  admin:joined.admin,
		// 	  room: joined.room
		// 	});
		//   });
		  
		// 	socket.on("authresponse", (res) => {
		// 		console.log('response', res)
		// 		if(res !== null && res !== undefined){
		// 		// res =JSON.parse(res)
		// 		 if(res.success == '1'){
		// 			this.setState({
				 
		// 				admin:true,
		// 				authResponse:res.success,
		// 				loading:false,
		// 				errorText:''
		// 			  });
		// 		 }else{
		// 			this.setState({
		// 		        errorText:res,
		// 				error:true,
		// 				loading:false
		// 			  });
		// 		 }
				
		// 	}else{
		// 		this.setState({
		// 			loading:false,
		// 			error:true
		// 		})
		// 	}
		// 	  });
		 
		
	}
	
    // componentDidUpdate(prevState){
	// 	if(prevState.room !== this.state.room)
    //         this.setState({
	// 			render:true
	// 		})
	// }
	
	async componentWillMount(prevState) {
		 email = await localStorage.getItem('user');
		 room = await localStorage.getItem('room');
		console.log('local storatge ', email, room)
		
		if (email && room) {
		console.log('if in to the cwm', room, email)
		
		  this.setState({ 
			  room: room,
			  email:email,
			  loading:false,
			 });
		} else {
		  this.setState({ 
			room: '',
			email:'',
			loading:false
		   });
		}
	  };
	componentDidMount() {
		let deferredPrompt;
		// let param1 = this.props.location.pathname;
		//let url = window.location.href;
		let param = window.location.pathname;
		 room = localStorage.getItem('room');
		 email = localStorage.getItem('user') ;
		console.log('async storage', room, email)
		this.setState({ 
		   room : room,
		   email : email	
		});
		if(param == '/'){
			this.setState({
				room:room,
				loading:false,
				admin:true, 
				user:false
			})
		}else {
			console.log('else is calling in app.js componendidmount')
			let str = param.substr(1, param.length - 1);
			console.log('in if condition', str)

			this.setState({
				//username: this.state.typing || this.state.username,
				room: str,
				loading:false,
				admin:false, 
				user:true, 
				id:null
			});
			console.log('room in cdadmin:truem', this.state.room)
		}
		console.log('path name', this.state.room)
		
		window.addEventListener("beforeinstallprompt", (e) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Update UI notify the user they can add to home screen
			deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === "accepted") {
					console.log("User accepted the A2HS prompt");
				} else {
					console.log("User dismissed the A2HS prompt");
				}
				deferredPrompt = null;
			});
		});
	}

	setEmail = (inputName, value) => {
		console.log('onchange email', value)
		this.setState({
			typingEmail: value
		});
	};
    setAccesskey = (inputName, value) => {
		
		this.setState({
			typingRoom: value
		});
	};
	getAuth =()=>  {
		this.setState({
			 loading:true,
			 room:this.state.typingRoom,
			 email:this.state.typingEmail
		})
		
		console.log('my rooms check',
		this.state.room,this.state.email, this.state.typingRoom
		)
		
		//const proxy_api ='https://cors-anywhere.herokuapp.com/'
		const apiUrl ='http://bakoredraw.com/draw/wp-admin/admin-ajax.php?action=check_user&email='+this.state.typingEmail+'&accesskey='+this.state.typingRoom;
		console.log('auth data',apiUrl)
		  fetch(apiUrl,{
			method:'GET',  
			headers: 
			{
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			},
		  })
			
		  .then((res) => res.json())
		  .then((res => {
				if(res !== null && res !== undefined){
				// res =JSON.parse(res)
				 if(res.success == '1'){
					this.setState({
				 
						admin:true,
						authResponse:res.success,
						loading:false,
						errorText:'',
						error:false
					  });
				localStorage.setItem('room',this.state.typingRoom);
				localStorage.setItem('user',this.state.typingEmail); 
				 }else{
					this.setState({
				        errorText:res,
						error:true,
						loading:false
					  });
				 }
				
			}else{
				this.setState({
					loading:false,
					error:true
				})
			}
			 
		  })).catch((e)=>{
			  // res =JSON.parse(res)
			  console.log('catch error', e)
			  this.setState({
				  loading:false,
				  error:true
			  })
		  })
		
		
		}
		
	
    logout =()=>{
		localStorage.removeItem("user");
		localStorage.removeItem("room");
		email = '';
		room = '';
		this.setState({
			email:'',
			room:'',
			typingEmail:'',
			typingRoom:'',
			authResponse:'',
			error:'',

		})
	}
	render() {
		console.log('render statess', this.state.room, this.state.authResponse, this.state)
		// const room =await localStorage.getItem('room');
		// const email = localStorage.getItem('user') ;

		if(this.state.loading){
			return(
				<div style = {{display:'flex',justifyContent:'center', alignItems:'center', marginTop:'25%'}}>
					<Dots/>
				</div>
			)
		}else{
			return(
				<div>
					{this.state.authResponse == '1' || (room && email)? (
						<WhiteBoard  {...this.state} logout = {this.logout}/>
					) : this.state.user ?( <WhiteBoard {...this.state}/> )
					:
					
						(<Choose
							{...this.state}
							getAuth={this.getAuth}
							setEmail={this.setEmail}
							setAccesskey={this.setAccesskey}
							error = {this.state.error}
							errorText = {this.state.errorText}
						/>)
					}
					
					</div>
			)
		}
		
		
			// if(this.state.loading ){
			// 	return(
			// 		<div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
			// 			<Dots/>
			// 		</div>
			// 	)
			// }else{
			// 	return(
			// 		<div className="App">
				
				
			// 		<WhiteBoard clearRoom={this.clearRoom} {...this.state} />
				
			// 	    </div>
			// 	)
			// }
			
		
	}
}

export default App;
// handleClick = (event) => {

// 	/* call prompt() with custom message to get user input from alert-like dialog */
// 	const enteredName = prompt('Please enter your name')

// 	/* update state of this component with data provided by user. store data
// 	   in 'enteredName' state field. calling setState triggers a render of
// 	   this component meaning the enteredName value will be visible via the
// 	   updated render() function below */
// 	this.setState({ user : enteredName })
//}
//http://bakoredraw.com/draw/wp-admin/admin-ajax.php?action=check_user&email=makkydevil1990@gmail.com&accesskey=f49a158c80
// email=makkydevil1990@gmail.com

// accesskey=f49a158c80