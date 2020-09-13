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
    for(var j = 3; j >= 0; j--)
    {
        for(var i = 0; i < hand.fingers.length; i++)
        {
            finger = hand.fingers[i];
            handleBone(finger.bones[j]);
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
        bone = finger.bones[i];
        handleBone(bone);

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

function handleBone(bone)
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
    if(bone.type == 0)
    {
        stroke('rgb(220,220,220)');
        strokeWeight(10);
        line(x, y, prevx, prevy);

    }
    if (bone.type == 1)
    {
        //stroke('rbg(192,192,192)');
        strokeWeight(7.5);
        line(x, y, prevx, prevy);

    }
    if (bone.type == 2)
    {
        stroke('rgb(150,150,150)');
        strokeWeight(5);
        line(x, y, prevx, prevy);

    }
    if (bone.type == 3)
    {
        stroke('rgb(70,70,70)');
        strokeWeight(2.5);
        line(x, y, prevx, prevy);
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