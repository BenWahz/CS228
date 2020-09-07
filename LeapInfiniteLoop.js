// JavaScript source code
var controllerOptions = {};
var x = (window.innerWidth)/2;
var y = (window.innerHeight)/2;
Leap.loop(controllerOptions, function(frame)
{
	//clear();
	//var rand1 = (Math.floor(Math.random()*5)-5); //Had to make values bigger because you could not see the movement from '1'
	//var rand2 = (Math.floor(Math.random()*5)-5);
	//circle(x+rand1,y+rand2,100)

	
	
	if (frame.hands.length == 1){
		var hand = frame.hands[0];
		var fingers = hand.fingers;
				

		console.log(fingers);
	}
}
);