var img;

function setup() {
	createCanvas(window.innerWidth,window.innerHeight);
	img = loadImage('https://i.imgur.com/NwmPeGe.jpeg'); // general
	imgHandTooLeft = loadImage('https://i.imgur.com/GmIbJba.png'); //left
	imgHandTooRight = loadImage('https://i.imgur.com/QnMvbYY.png'); //right
	imgHandTooFarBack = loadImage('https://i.imgur.com/vQS0jlT.png'); //back
	imgHandTooFarForward = loadImage('https://i.imgur.com/brMeMgk.png'); //forward
	imgHandTooHigh = loadImage('https://i.imgur.com/B7CdkaT.png'); //high
	imgHandTooLow = loadImage('https://i.imgur.com/SwggJCM.png'); //low
}