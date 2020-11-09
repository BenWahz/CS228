const knnClassifier = ml5.KNNClassifier();

var controllerOptions = {};

var numSamples = train9.shape[0];
//var numFeatures = (train9.shape[1])-1;

//var testingSampleIndex = 0;


var predictedClassLabels = nj.zeros([numSamples]);

var trainingCompleted = false;

var oneFrameOfData = nj.zeros([5,4,6]);

var digitToShow = 0;
var timeSinceLastDigitChange = new Date();
var mean_pred_accuracy = 0;
var num_predictions = 0;

var programState = 0; //indicates whether program is waiting to see users hand (0) or can see at least one hand (1)

//var predictedClassLabels = nj.zeros([numSamples]);


Leap.loop(controllerOptions, function(frame)
{
    clear();
    DetermineState(frame);
    if (programState == 0)
    {
        HandleState0(frame);

    }else if (programState == 1)
    {
        HandleState1(frame);

    }else if(programState == 2)
    {
        HandleState2(frame);
    }




    // console.log(irisData.toString());
    // console.log(numSamples);
    // console.log(numFeatures);
});

function SignIn()
{
    username = document.getElementById('username').value;
    var list = document.getElementById('users');



    if (IsNewUser(username,list))
    {
        CreateNewUser(username,list);

    }else
    {
        CreateSignInItem(username,list);
    }
    console.log("Signed In - " + username);

    console.log(list.innerHTML);

    return false;
}

function CreateNewUser(username,list)
{
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
    item = document.createElement('li');
    item.id = String(username) + "_signins";
    item.innerHTML = 1;
    list.appendChild(item);
}

function CreateSignInItem(username,list)
{
    var ID = String(username) + "_signins";
    var listItem = document.getElementById(ID);
    listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
}

function IsNewUser(username, list)
{
   var usernameFound = false;
   var users = list.children;

   //console.log(username);
   //print(users[0].innerHTML);
   for (i = 0; i < users.length; i++)
   {
       if (users[i].innerHTML === username)
       {
           usernameFound = true;
           // console.log(users[i]);
           // console.log(users[i].innerHTML);
       }
   }
   return usernameFound === false;


}

function DetermineState(frame)
{
    if (frame.hands.length == 0)
    {
        programState = 0;
    }else if(HandIsUncentered())
    {
        programState = 1;
    }else
    {
        programState = 2;
    }
}

function HandleState0(frame)
{
    TrainKNNIfNotDoneYet();
    DrawImageToHelpUserPutHandOverDevice();
}

function HandleState1(frame)
{
    HandleFrame(frame);
    if(HandIsTooFarToTheLeft())
    {
        DrawArrowRight();

    }else if(HandIsTooFarToTheRight())
    {
        DrawArrowLeft();

    }else if(HandIsTooFarBack())
    {
        DrawArrowForward();

    }else if(HandIsTooFarForward())
    {
        DrawArrowBack();
    }else if(HandIsTooLow())
    {
        DrawArrowUp();
    }else if(HandIsTooHigh())
    {
        DrawArrowDown();
    }
}

function HandleState2(frame)
{
    DetermineWhetherToSwitchDigits();
    DrawLowerRightPanel();
    HandleFrame(frame);
    Test()
}

function DrawLowerRightPanel()
{
    if(digitToShow === 0)
    {
        //draw 0 example
        image(example0,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
    }else
    {
        //draw 1 example
        image(example1,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
    }
}

function DetermineWhetherToSwitchDigits()
{
    if(TimeToSwitchDigits())
    {
        SwitchDigits();
    }
}

function SwitchDigits()
{
    if (digitToShow === 0)
    {
        digitToShow = 1;
    }else if (digitToShow === 1)
    {
        digitToShow = 0;
    }
    num_predictions = 0;
}

function TimeToSwitchDigits()
{
    let currentTime = new Date();
    changeInMilliseconds = currentTime - timeSinceLastDigitChange;
    changeInSeconds = changeInMilliseconds/1000;
    if (changeInSeconds >= 5)
    {
        timeSinceLastDigitChange = currentTime;
        return true;
    }else
    {
        return false;
    }
}

function TrainKNNIfNotDoneYet()
{
    if (trainingCompleted === false)
    {
        Train();
    }
}

function DrawImageToHelpUserPutHandOverDevice()
{
    image(img, 0,0,window.innerWidth/2,window.innerHeight/2);
}

function HandIsUncentered()
{
    return HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarForward() || HandIsTooFarBack() || HandIsTooLow() || HandIsTooHigh()
}


//Hand is too far where?
function HandIsTooFarToTheLeft()
{
    xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentXMean = xValues.mean();
    return currentXMean < 0.25;
}

function HandIsTooFarToTheRight()
{
    xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentXMean = xValues.mean();
    return currentXMean > 0.75;
}

function HandIsTooHigh()
{
    yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentYMean = yValues.mean();
    return currentYMean > 0.75;
}

function HandIsTooLow()
{
    yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentYMean = yValues.mean();
    return currentYMean < 0.25;
}

function HandIsTooFarForward()
{
    zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentZMean = zValues.mean();
    return currentZMean < 0.25;
}

function HandIsTooFarBack()
{
    zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentZMean = zValues.mean();
    return currentZMean > 0.75;
}

//   ---------------- Draw Arrows ---------------------
function DrawArrowRight()
{
    image(imgHandTooLeft, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function DrawArrowLeft()
{
    image(imgHandTooRight, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowForward()
{
    image(imgHandTooFarBack, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowBack()
{
    image(imgHandTooFarForward, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowUp()
{
    image(imgHandTooLow, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowDown()
{
    image(imgHandTooHigh, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function Train()
{
    console.log("I am being trained")
    for(var i = 0; i < train9.shape[3]; i++)
    {
        //TRAIN 0
        var features = train0He.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        console.log(features);

        features = train0Wills.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        console.log(features);

        features = train0Allison.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        console.log(features);

        // features = train0ReckordGroten.pick(null,null,null,i);
        // CenterData();
        // features = features.reshape(120).tolist();
        // knnClassifier.addExample(features, 0);
        // console.log(features);

        // features = train0Croxford.pick(null,null,null,i);
        // CenterData();
        // features = features.reshape(120).tolist();
        // knnClassifier.addExample(features, 0);
        // console.log(features);

        // features = train0Rielly.pick(null,null,null,i);
        // CenterData();
        // features = features.reshape(120).tolist();
        // knnClassifier.addExample(features, 0);
        // console.log(features);

        //TRAIN 1
        features = train1.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);

        features = train1Riofrio.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);

        features = train1Wolley.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);

        features = train1Allison.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        console.log(features);


        //TRAIN 2
        features = train2.pick(null,null,null,i);//rielly
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        console.log(features);

        features = train2Downs.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        console.log(features);

        features = train2Jimmo.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        console.log(features);

        features = train2Sheboy.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        console.log(features);
        
        //TRAIN 3
        features = train3Beattie.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Downs.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Luksevish.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Li.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Bongard.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Shi.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        features = train3Riofrio.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        console.log(features);

        //TRAIN 4
        features = train4.pick(null,null,null,i);//bertschinger
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Liu.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Beattie.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4OBrien.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Makovsky.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Faucher.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        // features = train4Sheboy.pick(null,null,null,i);
        // CenterData();
        // features = features.reshape(120).tolist();
        // knnClassifier.addExample(features, 4);
        // console.log(features);

        // features = train4Bongard.pick(null,null,null,i);
        // CenterData();
        // features = features.reshape(120).tolist();
        // knnClassifier.addExample(features, 4);
        // console.log(features);



        //TRAIN 5
        features = train5Faucher.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);
        console.log(features);

        features = train5Fekert.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);
        console.log(features);



        //TRAIN 6
        features = train6.pick(null,null,null,i); //Potts
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);

        features = train6Blewett.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);

        features = train6Bongard.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        console.log(features);



        //TRAIN 7
        features = train7Fisher.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7Laquerre.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7Pooprasert.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7Vega.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7Bongard.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7RiceA.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7RiceB.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7RiceC.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        features = train7RiceD.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        console.log(features);

        //TRAIN 8
        features = train8.pick(null,null,null,i); //matthews
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        console.log(features);

        features = train8Goldman.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        console.log(features);
        
        //TRAIN 9
        features = train9.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);
        console.log(features);
        
        
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
        CenterData();
        currentTestingSample = currentTestingSample.reshape(120).tolist();
        //var currentLabel = test.get(testingSampleIndex,-1); //classLabel
        var predictedLabel = knnClassifier.classify(currentTestingSample, GotResults);

        //console.log(predictedLabel.toString());
    //}
}

function GotResults(err, result)
{
    //predictedClassLabels[err] = parseInt(result.label);

    //n = num_predictions
    //m = mean_pred_accuracy
    //c =

    num_predictions++;
    mean_pred_accuracy = (((num_predictions - 1)*mean_pred_accuracy) + (parseInt(result.label)===digitToShow))/num_predictions


    //log n
    //log m
    //log c
    console.log(num_predictions, result.label, mean_pred_accuracy);
}

//draw();


function HandleFrame(frame)
{
    var InteractionBox = frame.InteractionBox;
    if (frame.hands.length >= 1) {
        var hand = frame.hands[0];
        HandleHand(hand,frame, InteractionBox)
        //console.log(oneFrameOfData.toString());
        //Test();
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
    oneFrameOfData.set(fingerIndex, boneIndex, 2, normalizedNextJoint[2]);
    oneFrameOfData.set(fingerIndex, boneIndex, 3, normalizedPrevJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 4, normalizedPrevJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 5, normalizedPrevJoint[2]);



    // y = -y + (window.innerHeight);
    // prevy = -prevy + (window.innerHeight);

    //console.log(oneFrameOfData.toString());

    var nextCanvasX = (window.innerWidth / 2) * normalizedNextJoint[0];
    var nextCanvasY = (window.innerHeight / 2) * (1-normalizedNextJoint[1]);
    var prevCanvasX = (window.innerWidth / 2) * normalizedPrevJoint[0];
    var prevCanvasY = (window.innerHeight / 2) * (1-normalizedPrevJoint[1]);

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

function CenterData()
{
    CenterXData();
    CenterYData();
    CenterZData();
}
function CenterXData()
{
    xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentXMean = xValues.mean();
    var horizontalShift = 0.5 - currentXMean;
    //console.log(currentXMean);
    for(i = 0; i < 5; i++)
    {
        for(j = 0; j < 4; j++)
        {
            var currentX = oneFrameOfData.get(i,j,0);
            var shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(i,j,0, shiftedX);

            currentX = oneFrameOfData.get(i,j,3);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(i,j,3, shiftedX);

            //console.log(currentX, shiftedX);
        }
    }

    currentXMean = xValues.mean();
    //console.log("after");
    //console.log(currentXMean);
}
function CenterYData()
{
    yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentYMean = yValues.mean();
    var verticalShift = 0.5 - currentYMean;
    //console.log(currentYMean);
    for(i = 0; i < 5; i++)
    {
        for(j = 0; j < 4; j++)
        {
            var currentY = oneFrameOfData.get(i,j,1);
            var shiftedY = currentY + verticalShift;
            oneFrameOfData.set(i,j,1, shiftedY);

            currentY = oneFrameOfData.get(i,j,4);
            shiftedY = currentY + verticalShift;
            oneFrameOfData.set(i,j,4, shiftedY);
        }
    }
    currentYMean = yValues.mean();
    //console.log(currentYMean);
}
function CenterZData()
{
    zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentZMean = zValues.mean();
    var zShift = 0.5 - currentZMean;
    //console.log(currentZMean);
    for(i = 0; i < 5; i++)
    {
        for(j = 0; j < 4; j++)
        {
            var currentZ = oneFrameOfData.get(i,j,2);
            var shiftedZ = currentZ + zShift;
            oneFrameOfData.set(i,j,2, shiftedZ);

            currentZ = oneFrameOfData.get(i,j,5);
            shiftedZ = currentZ + zShift;
            oneFrameOfData.set(i,j,5, shiftedZ);
            //console.log(currentZ, shiftedZ);
        }
    }
    currentZMean = zValues.mean();
    //console.log('after');
    //console.log(currentZMean);
}