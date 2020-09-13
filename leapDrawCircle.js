var controllerOptions = {};
var x = 0;
var y = 0;
var z = 0;

var rawXMin = 1000;
var rawXMax = 1;
var rawYMin = 1000;
var rawYMax = 1;

Leap.loop(controllerOptions, function(frame)
    {
        clear();
        //var rand1 = (Math.floor(Math.random()*5)-5); //Had to make values bigger because you could not see the movement from '1'
        //var rand2 = (Math.floor(Math.random()*5)-5);


        HandleFrame(frame);
        y = -y + (window.innerHeight);

        oldX = (rawXMax - rawXMin);
        oldY = (rawYMax - rawYMin);

        var scaledX = (((x - rawXMin) * (window.innerWidth)) / oldX);
        var scaledY = (((y - rawYMin) * (window.innerHeight)) / oldY);

        circle(scaledX, y,50);
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
        z = finger.tipPosition[2];
        y = finger.tipPosition[1];
        if(x < rawXMin)
        {
            rawXMin = x;
            console.log(rawXMin)

        }
        if(x > rawXMax)
        {
            rawXMax = x;
            console.log(rawXMax)

        }
        if(y < rawYMin)
        {
            rawYMin = y;
            console.log(rawYMin)

        }
        if(y > rawYMax)
        {
            rawYMax = y;
            console.log(rawYMax)

        }
        if (y < 0)
        {
            y = 0;
        }
        if (y > window.innerHeight)
        {
            y = window.innerHeight;
        }
        console.log(finger.tipPosition);
    }
}