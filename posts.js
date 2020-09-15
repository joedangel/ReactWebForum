const Pool = require('pg').Pool
const pool = new Pool({
	user: 'joe',
	host: 'localhost',
	database: 'db1',
	password: 'root',
	port: 5432,
});

const getPosts = () => {
	return new Promise(function(resolve, reject) {
		pool.query('select post, link, username, date, time from posts', (error, results)  => {
			if(error) {
				reject(error)
			}
			// resolve(results.rows.map((a) => a['post']));
			console.log("rows:")
			console.log(results.rows instanceof Array);
			resolve(results.rows);
		})
	})
}

const getUserPosts = (body) => {
	return new Promise(function(resolve, reject) {
		const {user} = body
		console.log(user)
		console.log(body)
		pool.query('select post, link, username, date, time from posts where username = ($1)', [user], (error, results)  => {
			if(error) {
				reject(error)
			}
			// resolve(results.rows.map((a) => a['post']));
			console.log("rows:")
			console.log(results.rows);
			resolve(results.rows);
		})
	})
}

const createPost = (body) => {
	return new Promise(function(resolve, reject) {

		const {post, username, date, time} = body
		var link = "None"
		if (post.includes("http")) {
			var temp = post.substring(post.indexOf("http"))
			link = temp.substring(0, temp.indexOf(" "))
		} else if (post.includes("www")) {
			var temp = post.substring(post.indexOf("www"))
			link = temp.substring(0, temp.indexOf(" "))
		}
		pool.query('insert into posts (post, link, username, date, time) values ($1, $2, $3, $4, $5) returning *', [post, link, username, date, time], (error, results) => {
			if (error) {
				reject(error)
			}
			console.log(results)
			resolve(`new post added: ${JSON.stringify(results.rows[0]['post'])}`)
		})
	})
}

const addUser = (body) => {
	return new Promise(function(resolve, reject) {

		const {username, pw} = body
		pool.query('select username from users where username = ($1)', [username], (error, results) => {
			if (results.rows.length > 0) {
				reject("username not available")
			} else {
				pool.query('insert into users (username, password) values ($1, $2) returning *', [username, pw], (error, results) => {
				if (error) {
					reject(error)
				}
				resolve('success: user added')
				})
			}
		})
		
	})
}

const signIn = (body) => {
	return new Promise(function(resolve, reject) {

		const {username, pw} = body
		pool.query('select password from users where username = ($1)', [username], (error, results)  => {
			if(error) {
				reject(error)
			}
			else if (results.rows.length == 0) {
				reject("user not found")
			}
			else if (results.rows.length > 1) {
				reject("multiple users found")
			}
			else if (results.rows[0]['password'] != pw) {
				console.log(results.rows[0]['password'])
				reject("wrong pw")
			}
			// resolve(results.rows);
			resolve("success");
		})
	})
}

const updateProfile = (body) => {
	return new Promise(function(resolve, reject) {

		const {name, bio, age, bday, loc, user} = body
		pool.query('update users set name = ($1), bio =  ($2), age = ($3), birthday = ($4), curr_city = ($5) where username = ($6)', [name, bio, age, bday, loc, user], (error, results) => {
			if (error) {
				reject(error)
			}
			console.log(results)
			resolve("success")
		})
	})
}

const getProfileData = (body) => {
	return new Promise(function(resolve, reject) {

		const {user} = body
		console.log(user)
		pool.query('select name, bio, age, birthday, curr_city from users where username = ($1)', [user], (error, results) => {
			if (error) {
				reject(error)
			}
			console.log("rows:")
			console.log(results.rows)
			resolve(results.rows)
		})
	})
}

module.exports = {
	getPosts,
	createPost,
	addUser,
	signIn,
	getUserPosts,
	updateProfile,
	getProfileData,
}
