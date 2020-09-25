const { Pool } = require('pg'); 
console.log("process.env.DATABASE_URL", process.env.DATABASE_URL)
const env = process.env.NODE_ENV || 'development';
console.log("env", env)
console.log("process.env.NODE_ENV", process.env.NODE_ENV)
let connectionString = {
	user: 'joe',
	host: 'localhost',
	database: 'db1',
	password: 'root',
	port: 5432,
};
// checking to know the environment and suitable connection string to use
if (false && env === 'development') {
    connectionString.database = 'db1';
} else {
	connectionString = {
	connectionString: "postgres://lsleokmzdiwesv:c8f05a38abdf9c0e63f809135551d0ac893b0066e730ca4f0ff6ea621bacce29@ec2-107-20-15-85.compute-1.amazonaws.com:5432/d3f0q7uhbj51vh",
	ssl: true
}; };
console.log("connectionString (hardcoded to be prod)", connectionString)
const pool = new Pool(connectionString);
pool.connect();
// pool.on('connect', () => console.log('connected to db'));

//don't use this in prod for security reasons
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;



const getPosts = () => {
	return new Promise(function(resolve, reject) {
		// pool.query('create table if not exists posts (post varchar(140), link varchar(90), username varchar(30), date varchar(10), time varchar(10) )')
		pool.query('select post, link, username, date, time from posts', (error, results)  => {
			if(error) {
				reject(error)
			}
			if (!results) {
				reject("no rows")
				return
			}
			// resolve(results.rows.map((a) => a['post']));
			console.log("rows:")
			// console.log(results.rows instanceof Array);
			resolve(results.rows);
		})
	})
}

const getUserPosts = (body) => {
	return new Promise(function(resolve, reject) {
		const {user} = body
		console.log(user)
		console.log(body)
		// pool.query('create table if not exists posts (post varchar(140), link varchar(90), username varchar(30), date varchar(10), time varchar(10) )')
		pool.query('select post, link, username, date, time from posts where username = ($1)', [user], (error, results)  => {
			if(error) {
				reject(error)
			}
			if (!results) {
				reject("no rows")
				return
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
		// pool.query('create table if not exists posts (post varchar(140), link varchar(90), username varchar(30), date varchar(10), time varchar(10) )')
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
		// pool.query('create table if not exists users (username varchar(30), password varchar(30), name varchar(30), bio varchar(70), age varchar(2), birthday varchar(20), loc varchar(20))')
		pool.query('select username from users where username = ($1)', [username], (error, results) => {
			if (results && results.rows.length > 0) {
				reject("username not available")
			} else {
				pool.query('insert into users (username, password) values ($1, $2) returning *', [username, pw], (error, results) => {
				if (error) {
					console.log(error)
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
		// pool.query('create table if not exists users (username varchar(30), password varchar(30), name varchar(30), bio varchar(70), age varchar(2), birthday varchar(20), loc varchar(20))')
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
		// pool.query('create table if not exists users (username varchar(30), password varchar(30), name varchar(30), bio varchar(70), age varchar(2), birthday varchar(20), loc varchar(20))')
		pool.query('update users set name = ($1), bio =  ($2), age = ($3), birthday = ($4), loc = ($5) where username = ($6)', [name, bio, age, bday, loc, user], (error, results) => {
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
		// pool.query('create table if not exists users (username varchar(30), password varchar(30), name varchar(30), bio varchar(70), age varchar(2), birthday varchar(20), loc varchar(20))')
		pool.query('select name, bio, age, birthday, loc from users where username = ($1)', [user], (error, results) => {
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