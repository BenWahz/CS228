var img;


// Object.defineProperty(window, 'text', {
// 	value: function() {
// 		console.log("TEXT WAS CALLED");
// 	},
// 	writable: false
// });

let myFont;
// function preload() {
// 	myFont = loadFont('assets/inconsolata.otf');
// 	textSize(32);
// 	text('word', 10, 30);
// 	fill(0, 102, 153);
// 	text('word', 10, 60);
// 	fill(0, 102, 153, 51);
// 	text('word', 10, 90);
// }


function setup() {
	createCanvas(window.innerWidth,window.innerHeight);
	img = loadImage('https://i.imgur.com/NwmPeGe.jpeg'); // general
	imgHandTooLeft = loadImage('https://i.imgur.com/GmIbJba.png'); //left
	imgHandTooRight = loadImage('https://i.imgur.com/QnMvbYY.png'); //right
	imgHandTooFarBack = loadImage('https://i.imgur.com/vQS0jlT.png'); //back
	imgHandTooFarForward = loadImage('https://i.imgur.com/brMeMgk.png'); //forward
	imgHandTooHigh = loadImage('https://i.imgur.com/B7CdkaT.png'); //high
	imgHandTooLow = loadImage('https://i.imgur.com/SwggJCM.png'); //low

	//Example Digit Image
	example0 = loadImage('https://i.imgur.com/JJLIeIM.png');
	example1 = loadImage('https://i.imgur.com/etqtpFi.png');
	example2 = loadImage('https://i.imgur.com/Muds3xc.png');
	example3 = loadImage('https://i.imgur.com/MOh6D7h.png');
	example4 = loadImage('https://i.imgur.com/wypANX0.png');
	example5 = loadImage('https://i.imgur.com/0nOvBWj.png');
	example6 = loadImage('https://i.imgur.com/hX5LqBv.png');
	example7 = loadImage('https://i.imgur.com/ewb9Zso.png');
	example8 = loadImage('https://i.imgur.com/yTB5YGe.png');
	example9 = loadImage('https://i.imgur.com/U7GI1sJ.png');

	plusSign = loadImage('https://i.imgur.com/O9kedAu.jpg');
	minusSign = loadImage('https://i.imgur.com/Gv5NcuW.jpg');

	digit0 = loadImage('https://i.imgur.com/jPD1Pjb.png');
	digit1 = loadImage('https://i.imgur.com/KSVnq5P.png');
	digit2 = loadImage('https://i.imgur.com/KPQZUCF.png');
	digit3 = loadImage('https://i.imgur.com/f3WoUHg.png');
	digit4 = loadImage('https://i.imgur.com/odkaST4.png');
	digit5 = loadImage('https://i.imgur.com/ulQAo2M.png');
	digit6 = loadImage('https://i.imgur.com/o4Pknez.png');
	digit7 = loadImage('https://i.imgur.com/AynXtcG.png');
	digit8 = loadImage('https://i.imgur.com/ypE7JL8.png');
	digit9 = loadImage('https://i.imgur.com/Mky1Ofa.png');
	digit10 = loadImage('https://i.imgur.com/pSBsMDb.jpg');
	digit11 = loadImage('https://i.imgur.com/I3fU0C6.jpg');
	digit12 = loadImage('https://i.imgur.com/ytCEzaS.jpg');
	digit13 = loadImage('https://i.imgur.com/mQ5swOE.png');
	digit14 = loadImage('https://i.imgur.com/bCwL6ck.jpg');
	digit15 = loadImage('https://i.imgur.com/Xzgbztm.jpg');
	digit16 = loadImage('https://i.imgur.com/beq40FZ.jpg');
	digit17 = loadImage('https://i.imgur.com/NpxaDV7.png');
	digit18 = loadImage('https://i.imgur.com/4hAhst1.png');

	championMedal = loadImage("https://i.imgur.com/D45DT7l.png");
	leaderBoardLogo = loadImage("https://i.imgur.com/9jsuYgJ.jpg");
	currentPointsLogo = loadImage("https://i.imgur.com/bxpMSLo.png");
	crownLogo = loadImage("https://i.imgur.com/CJw73WY.jpg");
	highScoreStar = loadImage("https://i.imgur.com/VkXC5nx.png");


}