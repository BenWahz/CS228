// JavaScript source code
var controllerOptions = {};
var x = 0;
var y = 0;
var z = 0;

Leap.loop(controllerOptions, function(frame)
{
	clear();
	//var rand1 = (Math.floor(Math.random()*5)-5); //Had to make values bigger because you could not see the movement from '1'
	//var rand2 = (Math.floor(Math.random()*5)-5);
	

	HandleFrame(frame);
	circle(x+((window.innerWidth)/2), (z)*(-1)+((window.innerHeight)),50)
}
);



function HandleFrame(frame)
{

	if (frame.hands.length == 1)
	{
		var hand = frame.hands[0];
		HandleHand(hand)
	}
}

function HandleHand(hand)
{
	for(var i = 0; i < hand.fingers.length; i++)
	{
		finger = hand.fingers[i];
		HandleFinger(finger);
	}
}

function HandleFinger(finger)
{
	if (finger.type == 1)
	{
		x = finger.tipPosition[0];
		y = finger.tipPosition[2];
		z = finger.tipPosition[1];
		console.log(finger.tipPosition);
	}
}