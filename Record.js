var controllerOptions = {};
var x = 0;
var y = 0;
var z = 0;

var previousNumHands = 0;
var currentNumHands = 0;


var rawXMin = 1000;
var rawXMax = 1;
var rawYMin = 1000;
var rawYMax = 1;

Leap.loop(controllerOptions, function(frame)
    {
        currentNumHands = frame.hands.length;
        // console.log(previousNumHands);
        // console.log(currentNumHands);

        clear();
        HandleFrame(frame);
        if (currentNumHands == 1 && previousNumHands == 2)
        {
            RecordData()
        }

        previousNumHands = currentNumHands;


    }
);



function HandleFrame(frame)
{

    if (frame.hands.length >= 1) {
        var hand = frame.hands[0];
        HandleHand(hand,frame)
    }
}

function HandleHand(hand,frame)
{
    for(var j = 3; j >= 0; j--)
    {
        for(var i = 0; i < hand.fingers.length; i++)
        {
            finger = hand.fingers[i];
            handleBone(finger.bones[j],frame);
        }
    }

}


function HandleFinger(finger)
{

    for(var i = 0; i < finger.bones.length; i++) {

        // if (y < 0)
        // {
        //     y = 0;
        // }
        // if (y > window.innerHeight)
        // {
        //     y = window.innerHeight;
        // }


        // x = finger.tipPosition[0];
        // z = finger.tipPosition[2];
        // y = finger.tipPosition[1];

        //bone stuff
        // bone = finger.bones[i];
        // handleBone(bone,frame);

        // Draw Circle
        // y = -y + (window.innerHeight);
        //
        // oldX = (rawXMax - rawXMin);
        // oldY = (rawYMax - rawYMin);
        //
        // var scaledX = (((x - rawXMin) * (window.innerWidth)) / oldX) + 0;
        // var scaledY = (((y - rawYMin) * (window.innerHeight)) / oldY) + 0;

        //circle(scaledX, scaledY,50);
    }
}

function handleBone(bone,frame)
{

    x = bone.nextJoint[0];
    y = bone.nextJoint[1];
    z = bone.nextJoint[2];


    prevx = bone.prevJoint[0];
    prevy = bone.prevJoint[1];
    prevz = bone.prevJoint[2];

    console.log(bone);
    //Draw Circle



    [x,y] = TransformCoordinates(x,y);
    [prevx, prevy] = TransformCoordinates(prevx,prevy);

    y = -y + (window.innerHeight);
    prevy = -prevy + (window.innerHeight);
    //circle(scaledX, scaledY,50);
    if (frame.hands.length == 1) {   //Draw hand Green
        if (bone.type == 0) {
            stroke('rgb(0,220,0)');
            strokeWeight(14);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 1) {
            //stroke('rbg(192,192,192)');
            strokeWeight(11);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 2) {
            stroke('rgb(0,150,0)');
            strokeWeight(8);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 3) {
            stroke('rgb(0,70,0)');
            strokeWeight(5);
            line(x, y, prevx, prevy);
        }
    }
    else //Draw hand Red
    {
        if (bone.type == 0) {
            stroke('rgb(220,0,0)');
            strokeWeight(14);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 1) {
            //stroke('rbg(192,192,192)');
            strokeWeight(11);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 2) {
            stroke('rgb(150,0,0)');
            strokeWeight(8);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 3) {
            stroke('rgb(70,0,0)');
            strokeWeight(5);
            line(x, y, prevx, prevy);
        }
    }


}

function TransformCoordinates(x,y)
{
    if (x < rawXMin) {
        rawXMin = x;
        console.log(rawXMin)

    }
    if (x > rawXMax) {
        rawXMax = x;
        console.log(rawXMax)

    }
    if (y < rawYMin) {
        rawYMin = y;
        console.log(rawYMin)

    }
    if (y > rawYMax) {
        rawYMax = y;
        console.log(rawYMax)
    }
    //y = -y + (window.innerHeight);
    //prevy = -prevy + (window.innerHeight);
    oldX = (rawXMax - rawXMin);
    oldY = (rawYMax - rawYMin);

    scaledx = (((x - rawXMin) * (window.innerWidth)) / oldX) + 0;
    scaledy = (((y - rawYMin) * (window.innerHeight)) / oldY) + 0;
    return [scaledx,scaledy]
}

function RecordData()
{
    background(51);
}