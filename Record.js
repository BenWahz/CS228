nj.config.printThreshold = 1000;

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

var numSamples = 2;
var currentSample = 0;

var framesOfData = nj.zeros([5,4,6,numSamples]);



Leap.loop(controllerOptions, function(frame)
    {


        currentNumHands = frame.hands.length;
        clear();
        HandleFrame(frame);

        RecordData();


        previousNumHands = currentNumHands;


    }
);



function HandleFrame(frame)
{
    var InteractionBox = frame.InteractionBox;
    if (frame.hands.length >= 1) {
        var hand = frame.hands[0];
        HandleHand(hand,frame, InteractionBox)
    }
}

function HandleHand(hand,frame,InteractionBox)
{
    for(var j = 3; j >= 0; j--)
    {
        for(var i = 0; i < hand.fingers.length; i++)
        {
            finger = hand.fingers[i];
            handleBone(finger.bones[j],frame,i,j,InteractionBox);
        }
    }

}


function HandleFinger(finger,frame,fingerIndex)
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
        handleBone(bone,frame);

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

function handleBone(bone, frame, fingerIndex, boneIndex, InteractionBox)
{



    //circle(scaledX, scaledY,50);

    //fingerSum = x + y + z + prevx + prevy + prevz;

    var normalizedNextJoint = frame.interactionBox.normalizePoint(bone.nextJoint,true);
    var normalizedPrevJoint = frame.interactionBox.normalizePoint(bone.prevJoint,true);
    // console.log("next joint:");
    // console.log(normalizedNextJoint);
    // console.log("Prev joint")
    // console.log(normalizedPrevJoint);

    //Set Tensor Values
    framesOfData.set(fingerIndex, boneIndex, 0, currentSample, normalizedNextJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 1, currentSample ,normalizedNextJoint[1]);
    framesOfData.set(fingerIndex, boneIndex, 2, currentSample, 1);
    framesOfData.set(fingerIndex, boneIndex, 3, currentSample, normalizedPrevJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 4, currentSample, normalizedPrevJoint[1]);
    framesOfData.set(fingerIndex, boneIndex, 5, currentSample, 1);
   // framesOfData.set(fingerIndex, boneIndex, 2, prevz);

   //  framesOfData.set(fingerIndex, boneIndex, 3, x);
   //  framesOfData.set(fingerIndex, boneIndex, 4, y);
   // framesOfData.set(fingerIndex, boneIndex, 5, z);

    // y = -y + (window.innerHeight);
    // prevy = -prevy + (window.innerHeight);

    //console.log(framesOfData.toString());

    var nextCanvasX = window.innerWidth * normalizedNextJoint[0];
    var nextCanvasY = window.innerHeight * (1-normalizedNextJoint[1]);
    var prevCanvasX = window.innerWidth * normalizedPrevJoint[0];
    var prevCanvasY = window.innerHeight * (1-normalizedPrevJoint[1]);

    // console.log(nextCanvasX);
    // console.log(prevCanvasY);

    var prevx = prevCanvasX;
    var prevy = prevCanvasY;
   // z = bone.nextJoint[2];


    var x = nextCanvasX;
    var y = nextCanvasY;
    //prevz = bone.prevJoint[2];


    //console.log(bone);
    //Draw Circle



    // [x,y] = TransformCoordinates(x,y);
    // [prevx, prevy] = TransformCoordinates(prevx,prevy);






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
        //console.log(rawXMin)

    }
    if (x > rawXMax) {
        rawXMax = x;
        //console.log(rawXMax)

    }
    if (y < rawYMin) {
        rawYMin = y;
        //console.log(rawYMin)

    }
    if (y > rawYMax) {
        rawYMax = y;
        //console.log(rawYMax)
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
    //console.log(framesOfData.toString())

    if(currentNumHands == 2)
    {
        currentSample++;

    }

    if (currentSample == numSamples)
    {
        currentSample = 0;
    }

    if (currentNumHands == 1 && previousNumHands == 2)
    {
        //console.log(currentSample);
        //console.log(framesOfData.toString())
        console.log(framesOfData.toString());
    }




}