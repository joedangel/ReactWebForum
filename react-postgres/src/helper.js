function getDate() {
		let date = new Date();
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		return month + "/" + day + "/" + year;
	}

function getTime() {
		let date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		return hour + ":" + minute;
	}

function cleanPostsData(data) {
	data = data.replaceAll("\"", "")
	data = data.replaceAll("date:", "")
	data = data.replaceAll("time:", "")
	data = data.replaceAll("post:", "--")
	data = data.replaceAll("username:", "")
	data = data.replaceAll("link:", "")
	data = data.replaceAll("[", "")
	data = data.replaceAll("]", "")
	data = data.replaceAll("{", "")
	data = data.replaceAll("}", "")
	data = data.split("--").map((post) => 
		post.split(","));
	data.shift();
	data.reverse();
	return data;
}

module.exports = {
	getDate,
	getTime,
	cleanPostsData,
}