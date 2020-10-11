const knnClassifier = ml5.KNNClassifier();

var controllerOptions = {};

var numSamples = train9.shape[0];
//var numFeatures = (train9.shape[1])-1;

//var testingSampleIndex = 0;


var predictedClassLabels = nj.zeros([numSamples]);

var trainingCompleted = false;

var oneFrameOfData = nj.zeros([5,4,6]);

//var predictedClassLabels = nj.zeros([numSamples]);


Leap.loop(controllerOptions, function(frame)
{
    clear();
    if (trainingCompleted == false)
    {
        Train();
    }
    HandleFrame(frame);



    // console.log(irisData.toString());
    // console.log(numSamples);
    // console.log(numFeatures);
});


function Train()
{
    console.log("I am being trained")
    for(var i = 0; i < 2; i++)
    {
        var features = train9.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);
        console.log(features);

        features = train1.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);
        //console.log(features);
    }
    console.log("I have been trained")

    trainingCompleted = true;
}


function Test()
{
    //console.log("I am testing");
    // for(var i = 0; i < 2; i++)
    // {
        var currentTestingSample = oneFrameOfData.pick(null,null,null,0);
        currentTestingSample = currentTestingSample.reshape(120).tolist();
        //var currentLabel = test.get(testingSampleIndex,-1); //classLabel
        var predictedLabel = knnClassifier.classify(currentTestingSample, GotResults);

        //console.log(currentTestingSample);
    //}

}

function GotResults(err, result)
{
    predictedClassLabels[err] = parseInt(result.label);
    // testingSampleIndex++;
    // if (testingSampleIndex > numSamples)
    // {
    //     testingSampleIndex = 0;
    // }
    console.log(parseInt(result.label));
}

//draw();


function HandleFrame(frame)
{
    var InteractionBox = frame.InteractionBox;
    if (frame.hands.length >= 1) {
        var hand = frame.hands[0];
        HandleHand(hand,frame, InteractionBox)
        //console.log(oneFrameOfData.toString());
        Test();
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
    oneFrameOfData.set(fingerIndex, boneIndex, 0, normalizedNextJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 1, normalizedNextJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 2, 1);
    oneFrameOfData.set(fingerIndex, boneIndex, 3, normalizedPrevJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 4, normalizedPrevJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 5, 1);



    // y = -y + (window.innerHeight);
    // prevy = -prevy + (window.innerHeight);

    //console.log(oneFrameOfData.toString());

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





        if (bone.type == 0) {
            stroke('rgb(220,220,220)');
            strokeWeight(14);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 1) {
            //stroke('rbg(192,192,192)');
            strokeWeight(11);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 2) {
            stroke('rgb(150,150,150)');
            strokeWeight(8);
            line(x, y, prevx, prevy);

        }
        if (bone.type == 3) {
            stroke('rgb(70,70,70)');
            strokeWeight(5);
            line(x, y, prevx, prevy);
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