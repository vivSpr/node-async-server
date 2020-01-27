const express = require('express');
const app = express();
const port = 3000

function waitAndRespond(fn, seconds) {
	if (typeof parseInt(seconds) == 'number'){
		setTimeout(fn, seconds * 1000)
	} else {
		setTimeout(fn, 5000);
	}
}

function numberIsValid(number) {
	var numbers = number.split("");
	var rightMostNumber = parseInt(numbers.pop());
	var total = numbers
		.map(int => parseInt(int))
		.reduce((accum, current) => accum + current);

	return total % 10 == rightMostNumber;
}

function generateNumber() {
	var bigNumber = Math.floor(Math.random() * 100000000 + 1);
	var arrayOfDigits = Array.from(String(bigNumber), Number);
	var checkSum = arrayOfDigits.reduce((accum, current) => accum + current, 0) % 10;

	return parseInt(arrayOfDigits.concat(checkSum).join(""));
}

app.get('/waitAndRespond', 
	(req, res) => {
		waitAndRespond(function () { res.send({"id": Math.floor((Math.random() * 10) + 1)}) }, req.query.seconds)
	}
);

app.get('/waitAndError',
	(req, res) => {
		waitAndRespond(function () { res.status(400).send('Bad Request') }, req.query.seconds);
	}
);

app.get('/publish', (req, res) => res.send({"jobId": generateNumber()}));
app.get('/status', (req, res) => {
	var jobId = parseInt(req.query.jobId);
	if (numberIsValid(jobId) && typeof jobId == 'number') {
		if (Math.floor(Math.random() * 10 + 1) > 7) {
			res.send({"id": Math.floor(Math.random()*1000+1), "status": "complete", "jobId": jobId});
		} else {
			res.send({"status": "processing", "jobId": jobId});
		}
	} else {
		res.status(400).send("Bad Request: unknown job");
	}
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
