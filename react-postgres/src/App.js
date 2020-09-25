import React, {useState, useEffect} from 'react';
import {Modal, Form, Input, Button, PageHeader, Descriptions} from 'antd';
import 'antd/dist/antd.css';

const helper = require('./helper')

function App() {

	const [posts, setPosts] = useState();
	const [user, setUser] = useState("");
	
	useEffect(() => {
		getPost();
	}, []);

	function getPost() {
		// fetch('http://localhost:3001')
		// fetch('https://mysterious-fortress-36805.herokuapp.com/')
		fetch('/')
		.then(response => {
			var txt = response.text();
			return txt;
		})
		.then(data => {
			console.log(data.split("},") instanceof Array)
			data = helper.cleanPostsData(data)
			setPosts(data);
			console.log(data);
			console.log(posts);
		});
	}

	function getUser() {
		return user;
	}
	
	function createPost() {
		let post = prompt('Enter post') + " ";
		if (post.length > 135) {
			alert("post is too long")
			return
		}
		let username = getUser();
		let date = helper.getDate();
		let time = helper.getTime();
		// fetch('http://localhost:3001/posts', {
		// fetch('https://mysterious-fortress-36805.herokuapp.com/posts', {
		fetch('/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({post, username, date, time}),

		})
		.then(response => {
			return response.text();
		})
		.then(data => {
			alert(data);
			// alert("joeee");
			getPost();
		});
	}

	const [userViewed, setUserViewed] = useState();

	// function userClicked(e) {
	// 	setUserViewed(e.target.value);
	// 	console.log(e.target)
	// 	console.log(e.target.value)
	// }

	return (
		<div>
			{!user && <SignInOrSignUp setUser={setUser}/>}
			{userViewed && <Profile user={userViewed} curr_user={user} onClick={setUserViewed}/>}
			<button onClick={createPost}> Add post </button>
			<br />
			{posts ? <Posts posts={posts} onClick={setUserViewed}/> : 'no posts'}
			<br/>
		</div>
	);
}

function SignInOrSignUp(props) {
	const [checked, setChecked] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);

	function onClicked() {
		setChecked(!checked);
	}

	function userLoggedIn() {
		setLoggedIn(true)
	}

	// console.log(loggedIn)

	let form;
	let title;

	if (checked) {
		form = <SignUp/>
		title = "Register a new account"
	}
	else {
		form = <SignIn onLogin={userLoggedIn} setUser={props.setUser}/>
		title = "Sign in"
	}

	let swap_flow_button;
	if (checked) {
		swap_flow_button = <Button onClick={onClicked}> Sign in instead </Button>
	} else {
		swap_flow_button = <Button onClick={onClicked}> Register instead </Button>
	}
	
	return (
		<Modal title={title} visible={!loggedIn} footer={null}>
			{form}
			{swap_flow_button}
		</Modal>
	);
}

function SignIn(props) {
	const [username, setUsername] = useState("")
	const [pw, setPw] = useState("")

	function SignInSubmit() {
		if (username.length === 0 || pw.length === 0) {
			alert("username or password too short")
			return;
		} else if (username.length > 25 || pw.length > 25) {
			alert("username or password too long")
			return;
		}
		// fetch('http://localhost:3001/signIn', {
		// fetch('https://mysterious-fortress-36805.herokuapp.com/signIn', {
		fetch('/signIn', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username, pw}),

			})
			.then(response => {
				return response.text();
			})
			.then(data => {
				// alert(data);
				if (data === "success") {
					props.onLogin()
					props.setUser(username)
				}
				
				
			}
		);
	}

	function usernameChanged(e) {
		setUsername(e.target.value)
		console.log(e.target.value)
	}
	function pwChanged(e) {
		setPw(e.target.value)
		console.log(e.target.value)
	}

	return (
		<Form>
			<Form.Item label="username" onChange={usernameChanged}>
			<Input/>
			</Form.Item>
			<Form.Item label="pin" onChange={pwChanged}>
			<Input/>
			</Form.Item>
			<Form.Item>
			<Button onClick={SignInSubmit}> Sign in </Button>
			</Form.Item>
		</Form>
	);
}

function SignUp(props) {
	const [username, setUsername] = useState("")
	const [pw, setPw] = useState("")

	function SignUpSubmit(props) {
		if (username.length === 0 || pw.length === 0) {
			alert("username or password too short")
			return;
		}
		else if (username.length > 25 || pw.length > 25) {
			alert("username or password too long")
			return;
		}
		// fetch('http://localhost:3001/addUser', {
		// fetch('https://mysterious-fortress-36805.herokuapp.com/addUser', {
		fetch('/addUser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username, pw}),

			})
			.then(response => {
				return response.text();
			})
			.then(data => {
				alert(data);				
			}
		);
	}

	function usernameChanged(e) {
		setUsername(e.target.value)
		console.log(e.target.value)
	}
	function pwChanged(e) {
		setPw(e.target.value)
		console.log(e.target.value)
	}

	return (
		<Form>
			<Form.Item label="username">
				<Input onChange={usernameChanged}/>
			</Form.Item>
			<Form.Item label="pin">
				<Input placeholder="choose a 1-24 digit pin" onChange={pwChanged}/>
			</Form.Item>
			<Form.Item>
				<Button onClick={SignUpSubmit}> Register </Button>
			</Form.Item>
		</Form>
	);
}


function Profile(props) {
	const [posts, setPosts] = useState()
	const [editProfile, setEditProfile] = useState(false)
	
	function getPosts(user) {
		// fetch('http://localhost:3001/userPosts', {
		// fetch('https://mysterious-fortress-36805.herokuapp.com/userPosts', {
		fetch('/userPosts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({user}),

		})
		.then(response => {
			var txt = response.text();
			return txt;
		})
		.then(data => {
			console.log(data.split("},") instanceof Array)
			data = helper.cleanPostsData(data);
			console.log(data);
			console.log(posts);
			setPosts(data)
		});
	}

	if (!posts) {
		console.log("posts")
		getPosts(props.user);
	}

	var title = props.user + "'s Profile"

	function editProfileFn() {
		setEditProfile(!editProfile);
	}

	function updateProfile() {
		console.log("profile udpated")
		editProfileFn();
	}

	

	return (
	<>
		<Modal footer={null} title={title} visible="true" onOk={() => props.onClick("")} onCancel={() => props.onClick("")}>
			{props.user === props.curr_user && <Button onClick={editProfileFn}> Edit Profile </Button>}
			<ProfileData user={props.user}/>
			{posts && posts.map((post) => <UsersPosts post={post}/>)}
		</Modal>
		{editProfile && <EditProfile title={title} updateProfile={updateProfile} user={props.user}/>}
	</>
	);
}

function ProfileData(props) {
	const [profileData, setProfileData] = useState()
	
	function getProfileData(user) {
		// fetch('http://localhost:3001/getProfileData', {
		// fetch('https://mysterious-fortress-36805.herokuapp.com/getProfileData', {
		fetch('/getProfileData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({user}),

		})
		.then(response => {
			var txt = response.text();
			return txt;
		})
		.then(data => {
			data=data.replace("\"name\":", "")
			data=data.replace("\"bio\":", "")
			data=data.replace("\"age\":", "")
			data=data.replace("\"birthday\":", "")
			data=data.replace("\"loc\":", "")
			data=data.replace("]", "")
			data=data.replace("\[", "")
			data=data.replace("{", "")
			data=data.replace("}", "")
			data=data.replaceAll("\"", "")
			data=data.split("\,")
			setProfileData(data);
			alert(profileData + " -> profile data")
		});
	}

	useEffect(() => {
		console.log("set profile data")
		getProfileData(props.user);
	}, []);

	return (
	<>
		<hr/>
		<PageHeader title={profileData && profileData[0]} subTitle="subtitle">
			<h3> {profileData && profileData[1]} </h3>
			<Descriptions>
				<Descriptions.Item label="age"> {profileData && profileData[2]} </Descriptions.Item>
				<Descriptions.Item label="bday"> {profileData && profileData[3]} </Descriptions.Item>
				<Descriptions.Item label="loc"> {profileData && profileData[4]} </Descriptions.Item>
			</Descriptions>
		</PageHeader>
		<hr/>
	</>
	);
}

function EditProfile(props) {
	const [name, setName] = useState()
	const [bio, setBio] = useState()
	const [age, setAge] = useState()
	const [bday, setBday] = useState()
	const [loc, setLoc] = useState()
	const user = props.user

	function onNameChange(e) {
		setName(e.target.value);
	}
	function onBioChange(e) {
		setBio(e.target.value);
	}
	function onAgeChange(e) {
		setAge(e.target.value);
	}
	function onBdayChange(e) {
		setBday(e.target.value);
	}
	function onLocChange(e) {
		setLoc(e.target.value);
	}

	function setProfile() {
		if (name && name.length > 28) {
			alert("name too long")
			return;
		}
		else if (bio && bio.length > 68) {
			alert("bio too long")
			return;
		} else if (age && age.length > 2) {
			alert("age too long")
			return;
		} else if (bday && bday.length > 18) {
			alert("bday too long")
			return;
		} else if (loc && loc.length > 18) {
			return;
		}
		// fetch('http://localhost:3001/updateProfile', {
		// fetch('https://mysterious-fortress-36805.herokuapp.com/updateProfile', {
		fetch('/updateProfile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({name, bio, age, bday, loc, user}),

			})
			.then(response => {
				return response.text();
			})
			.then(data => {
				alert(data + " profile updated");				
			}
		);


		props.updateProfile();
	}

	return (
		<Modal title={props.title} visible="true" onOk={setProfile}>
			<Form>
				<Form.Item label="name" onChange={onNameChange}>
				<Input/>
				</Form.Item>
				<Form.Item label="bio" onChange={onBioChange}>
				<Input/>
				</Form.Item>
				<Form.Item label="age" onChange={onAgeChange}>
				<Input/>
				</Form.Item>
				<Form.Item label="birthday" onChange={onBdayChange}>
				<Input/>
				</Form.Item>
				<Form.Item label="current location" onChange={onLocChange}>
				<Input/>
				</Form.Item>
			</Form>
		</Modal> 
	);
}

function UsersPosts(props) {
	return (
		<>
			<Message msg={props.post[0]} link={props.post[1]} />
			<p> {props.post[2]} </p>
			<p> {props.post[3]} {props.post[4]} </p>
		</>
	);
}


function Posts(props) {
	return (
			props.posts.map((post) => <p style={{width:300, marginLeft:400}}> <Post post={post} onClick={props.onClick}/> <hr/> </p>)
	);
}

function Post(props) {
	return (
		<>
			<Message msg={props.post[0]} link={props.post[1]} />
			<Button value={props.post[2]} onClick={() => props.onClick(props.post[2])}> {props.post[2]} </Button>
			<p> {props.post[3]} {props.post[4]} </p>
		</>
	);
}

function Message(props) {
	if (props.link && props.link.length > 5) {
		var link = props.link
		var beg = props.msg.substring(0, props.msg.indexOf(props.link))
		var end = props.msg.substring(props.msg.indexOf(props.link) + props.link.length)
		if (!link.includes("http")) {
			link = "https://" + link;
		}
		return <h3> {beg} <a href={link}>{link} </a> {end} </h3>;
	} else {
		return <h3> {props.msg} </h3>;
	}
}

export default App;
