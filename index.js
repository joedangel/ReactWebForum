const express = require('express')
const app = express()
const port = 3001

const posts = require('./posts')

app.use(express.json())
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
	next();
});

app.get('https://mysterious-fortress-36805.herokuapp.com/', (req, res) => {
	posts.getPosts()
	.then(response => {
		console.log(response instanceof Array)
		res.status(200).send(response);
})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.post('https://mysterious-fortress-36805.herokuapp.com/userPosts', (req, res) => {
	console.log(req.body)
	posts.getUserPosts(req.body)
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.post('https://mysterious-fortress-36805.herokuapp.com/posts', (req, res) => {
	posts.createPost(req.body)
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.post('https://mysterious-fortress-36805.herokuapp.com/addUser', (req, res) => {
	posts.addUser(req.body)
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.post('https://mysterious-fortress-36805.herokuapp.com/signIn', (req, res) => {
	posts.signIn(req.body)
	.then(response => {
		res.status(200).send(response);
})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.post('https://mysterious-fortress-36805.herokuapp.com/updateProfile', (req, res) => {
	console.log(req.body)
	posts.updateProfile(req.body)
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.post('https://mysterious-fortress-36805.herokuapp.com/getProfileData', (req, res) => {
	console.log(req.body)
	posts.getProfileData(req.body)
	.then(response => {
		res.status(200).send(response);
	})
	.catch(error => {
		res.status(500).send(error);
	})
})

app.listen(process.env.PORT || port, () => {
	console.log(`App running on port ${port}.`)
})

