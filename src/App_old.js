import React, { Component } from "react";
import WhiteBoard from "./components/WhiteBoard";
// import Choose from "./components/Choose";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss";
import "./components/style.css"

import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			typing: "",
			room: "",
			typingRoom: "",
			admin:false,
			loading:true
		};
	}
    // componentDidUpdate(prevState){
	// 	if(prevState.room !== this.state.room)
    //         this.setState({
	// 			render:true
	// 		})
	// }
	componentDidMount() {
		let deferredPrompt;
		const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const user = urlParams.get('user')
const room = urlParams.get('room')
 console.log('my url parametere', user, room);
		let param = window.location.pathname;
		//  room = localStorage.getItem('room');
		//  email = localStorage.getItem('user') ;
		// console.log('async storage', room, email)
		// this.setState({ 
		//    room : room,
		//    email : email	
		// });
		if(user){
			console.log('if in user true', user)
			this.setState({
				room:room,
				loading:false,
				admin:false, 
				user:true
			})
		}else {
			console.log('else is calling in app.js componendidmount')
			let str = param.substr(1, param.length - 1);
			console.log('in if condition', str)

			this.setState({
				//username: this.state.typing || this.state.username,
				room:'abc',
				loading:false,
				admin:true, 
				user:false
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
	// changeHandler = (inputName, value) => {
	// 	this.setState({
	// 		[inputName]: value
	// 	});
	// };

	// setUsername = () => {
	// 	if (
	// 		this.state.typing.length <= 25 &&
	// 		this.state.typingRoom.length <= 25
	// 	) {
	// 		this.setState({
	// 			username: this.state.typing || this.state.username,
	// 			room: this.state.typingRoom.toUpperCase()
	// 		});
	// 	}
	// };

	clearRoom = () => {
		this.setState({
			
			room: "",
			typingRoom: "",
			
		});
	};

	render() {
		console.log('render statess', this.state.room)
		
			if(this.state.loading ){
				return(
					<div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
						<Dots/>
					</div>
				)
			}else{
				return(
					<div className="App">
				        <WhiteBoard clearRoom={this.clearRoom} {...this.state} />
					
					</div>
				)
			}
			
		
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