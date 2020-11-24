const knnClassifier = ml5.KNNClassifier();

var controllerOptions = {};

var numSamples = train9.shape[0];
//var numFeatures = (train9.shape[1])-1;

//var testingSampleIndex = 0;


var predictedClassLabels = nj.zeros([numSamples]);

var trainingCompleted = false;

var oneFrameOfData = nj.zeros([5,4,6]);


var timeSinceLastDigitChange = new Date();
var mean_pred_accuracy = 0;
var num_predictions = 0;

var programState = 0; //indicates whether program is waiting to see users hand (0) or can see at least one hand (1)

var digitList = [0,1]
var digitIndex = 0;
var userHasPracticed = false;

var user_accuracy = {"0":0, "1":0, "2":0, "3":0, "4":0, "5":0, "6":0, "7":0, "8":0, "9":0};
var user_num_pred = {"0":0, "1":0, "2":0, "3":0, "4":0, "5":0, "6":0, "7":0, "8":0,  "9":0};

var currentEquationDataAddition = [1,2,3];
var currentEquationDataSubtraction = [3,2,1];
var digitToShow = currentEquationDataAddition[2];

var additionSwitch = true;
//var predictedClassLabels = nj.zeros([numSamples]);


Leap.loop(controllerOptions, function(frame)
{
    clear();
    DetermineState(frame);
    //console.log(num_predictions, programState)
    //generateSumEquation();

    if (programState === 0)
    {
        HandleState0(frame);

    }else if (programState === 1)
    {
        HandleState1(frame);

    }else if(programState === 2) //ready to play
    {
        DrawEquation();
        HandleState2(frame);
        //playMath();
    }
    // console.log(irisData.toString());
    // console.log(numSamples);
    // console.log(numFeatures);
});

function generateSumEquation()
{
    var answer = Math.floor(Math.random() * (10));
    var x = Math.floor(Math.random() * answer);
    var y  = answer - x;
    console.log(x + " + " + y + " = " + answer);
    currentEquationDataAddition = [x, y,answer];
}

function generateSubtractionEquation()
{
    var answer = Math.floor(Math.random() * (10));
    var y = Math.floor(Math.random() * answer);
    var x  = answer + y;
    console.log(x + " - " + y + " = " + answer);
    currentEquationDataSubtraction = [x, y, answer];
}

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
    //console.log("Determinging State...")
    if (frame.hands.length === 0)
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
    //mean_pred_accuracy = 0;
    num_predictions = 0;
}

function HandleState1(frame) //not centered
{
    console.log("Handling State 1...");
    if(HandIsTooFarToTheLeft())
    {
        console.log("Hand is Too Far Left");
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
    HandleFrame(frame);
}

function HandleState2(frame) //hand is center
{
    DetermineWhetherToSwitchDigits();
    //DrawLowerRightPanel();

    HandleFrame(frame);
    Test()

    //DisplayTextInLowerLeft();
}

function DrawEquation()
{
    var xval;
    var yval;

    //plus sign
    if(additionSwitch === true)
    {
        xval = currentEquationDataAddition[0];
        yval = currentEquationDataAddition[1];
        image(plusSign, (window.innerWidth/4)*2,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }
    else
    {
        xval = currentEquationDataSubtraction[0];
        yval = currentEquationDataSubtraction[1];
        image(minusSign, (window.innerWidth/4)*2,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }


    //     draw X
    if(xval === 0)
    {
        //draw 0 example
        image(digit0,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 1)
    {
        //draw 1 example
        image(digit1,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 2)
    {
        //draw 2 example
        image(digit2,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 3)
    {
        //draw 3 example
        image(digit3,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 4)
    {
        //draw 4 example
        image(digit4,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 5)
    {
        //draw 5 example
        image(digit5,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 6)
    {
        //draw 6 example
        image(digit6,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 7)
    {
        //draw 7 example
        image(digit7,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 8)
    {
        //draw 8 example
        image(digit8,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 9) {
        //draw 9 example
        image(digit9, (window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }
    else if(xval === 10)
    {
        //draw 0 example
        image(digit10,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 11)
    {
        //draw 1 example
        image(digit11,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 12)
    {
        //draw 2 example
        image(digit12,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 13)
    {
        //draw 3 example
        image(digit13,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 14)
    {
        //draw 4 example
        image(digit14,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 15)
    {
        //draw 5 example
        image(digit15,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 16)
    {
        //draw 6 example
        image(digit16,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 17)
    {
        //draw 7 example
        image(digit17,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (xval === 18)
    {
        //draw 8 example
        image(digit18,(window.innerWidth/4),(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }

    // draw Y
    if(yval === 0)
    {
        //draw 0 example
        image(digit0,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 1)
    {
        //draw 1 example
        image(digit1,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 2)
    {
        //draw 2 example
        image(digit2,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 3)
    {
        //draw 3 example
        image(digit3,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 4)
    {
        //draw 4 example
        image(digit4,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 5)
    {
        //draw 5 example
        image(digit5,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 6)
    {
        //draw 6 example
        image(digit6,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 7)
    {
        //draw 7 example
        image(digit7,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 8)
    {
        //draw 8 example
        image(digit8,(window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }else if (yval === 9) {
        //draw 9 example
        image(digit9, (window.innerWidth/4)*3,(window.innerHeight/4)*3, window.innerWidth/4, window.innerHeight/4);
    }
}


function DrawLowerRightPanel()
{
    if(userHasPracticed === false)
    {
        if(digitToShow === 0)
        {
            //draw 0 example
            image(example0,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 1)
        {
            //draw 1 example
            image(example1,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 2)
        {
            //draw 2 example
            image(example2,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 3)
        {
            //draw 3 example
            image(example3,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 4)
        {
            //draw 4 example
            image(example4,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 5)
        {
            //draw 5 example
            image(example5,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 6)
        {
            //draw 6 example
            image(example6,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 7)
        {
            //draw 7 example
            image(example7,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 8)
        {
            //draw 8 example
            image(example8,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/3);
        }else if (digitToShow === 9) {
            //draw 9 example
            image(example9, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 3);
        }
    }else
    {
        if(digitToShow === 0)
        {
            //draw 0 example
            image(digit0,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 1)
        {
            //draw 1 example
            image(digit1,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 2)
        {
            //draw 2 example
            image(digit2,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 3)
        {
            //draw 3 example
            image(digit3,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 4)
        {
            //draw 4 example
            image(digit4,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 5)
        {
            //draw 5 example
            image(digit5,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 6)
        {
            //draw 6 example
            image(digit6,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 7)
        {
            //draw 7 example
            image(digit7,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 8)
        {
            //draw 8 example
            image(digit8,window.innerWidth/2,window.innerHeight/2, window.innerWidth/2, window.innerHeight/2);
        }else if (digitToShow === 9) {
            //draw 9 example
            image(digit9, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
        }
    }

}


function DetermineWhetherToAddDigit()
{
    var flag = true
    if(digitList.length === 10)
    {
        if(user_accuracy["9"] > 0.25)
        {
            userHasPracticed = true;
        }
        return false;

    }else {
        for (var key in user_accuracy) {

            if (user_accuracy[key] < 0.275 && parseInt(key) < digitList.length)   ///threshold to reach before adding more digits to sign
                flag = false
        }
        return flag
    }
}

function AddDigit()
{
    //console.log("!!!!! CHECKING IF CAN ADD DIGIT !!!");
    if(DetermineWhetherToAddDigit())
    {
        //console.log("!!!!! ADDING DIGIT !!!");
        digitList.push(digitList.length);
    }
}

function DetermineWhetherToSwitchDigits()
{
    if(TimeToSwitchDigits())
    {
        //AddDigit();
        SwitchDigits();

    }
}

function SwitchDigits()
{
    //set num pred accuracy to the users recorded num_predictions
    var r = Math.floor(Math.random()*10);   //Set this to random to determine randomly whether to show addition or subtraction
    console.log(r)
    if(mean_pred_accuracy > 0.3)
    {
        if(r%2 === 0)
        {
            additionSwitch = true;
            generateSumEquation();
            digitToShow = currentEquationDataAddition[2];
            num_predictions = 0;
        }else{
            additionSwitch = false;
            generateSubtractionEquation();
            digitToShow = currentEquationDataSubtraction[2];
            num_predictions = 0;
        }

    }

    // if(digitToShow !== digitList.length - 1)
    // {
    //     //digitToShow += 1;
    //     num_predictions = 0;
    //     //digitIndex += 1;
    //
    //     mean_pred_accuracy = 0;
    //     num_predictions = 0;
    //     //num_predictions = user_num_pred[(digitToShow+1).toString()];
    //     //mean_pred_accuracy = user_accuracy[(digitToShow + 1).toString()];
    //
    // }else
    // {
    //
    //     //digitToShow = 0;
    //     num_predictions = 0;
    //     mean_pred_accuracy = 0;
    //     num_predictions = 0;
    //
    // }




    //num_predictions = 0;
    //mean_pred_accuracy = 0;
}

function TimeToSwitchDigits()
{
    let currentTime = new Date();
    changeInMilliseconds = currentTime - timeSinceLastDigitChange;
    changeInSeconds = changeInMilliseconds/1000;
    if(userHasPracticed === false)
    {
        if (changeInSeconds > 10 || ((user_accuracy[digitToShow.toString()] >= 0.275)) && changeInSeconds > 4)  //determine here condition to switch digit
        {
            timeSinceLastDigitChange = currentTime;
            return true;
        }else
        {
            return false;
        }
    }else
    {
        if (((user_accuracy[digitToShow.toString()] >= 0.5)))  //determine here condition to switch digit
        {
            timeSinceLastDigitChange = currentTime;
            return true;
        }else
        {
            return false;
        }
    }

}

function DisplayTextInLowerLeft()
{
    textSize(32);
    p5.text("TEST", window.innerWidth/4,window.innerHeight/4);
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
    //console.log("Checking if hand is uncentered");

    return (HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarForward() || HandIsTooFarBack() || HandIsTooLow() || HandIsTooHigh());
}


//Hand is too far where?
function HandIsTooFarToTheLeft()
{
    //console.log("Checking if hand is TOO FAR LEFT");
    let xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentXMean = xValues.mean();
    return (currentXMean < 0.25);
}

function HandIsTooFarToTheRight()
{
    let xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentXMean = xValues.mean();
    return (currentXMean > 0.75);
}

function HandIsTooHigh()
{
    let yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentYMean = yValues.mean();
    return (currentYMean > 0.75);
}

function HandIsTooLow()
{
    let yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentYMean = yValues.mean();
    return (currentYMean < 0.25);
}

function HandIsTooFarForward()
{
    let zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentZMean = zValues.mean();
    return (currentZMean < 0.25);
}

function HandIsTooFarBack()
{
    let zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentZMean = zValues.mean();
    //console.log("Z Mean = " + currentZMean);
    return (currentZMean > 0.75);
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

        // features = train4OBrien.pick(null,null,null,i);
        // CenterData();
        // features = features.reshape(120).tolist();
        // knnClassifier.addExample(features, 4);
        // console.log(features);

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

        features = train4Sheboy.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);

        features = train4Bongard.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        console.log(features);



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

        features = train5Manian.pick(null,null,null,i);
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

        features = train8Wills.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        console.log(features);

        features = train8Timsina.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        console.log(features);

        features = train8Bongard.pick(null,null,null,i);
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

        features = train9McLaughlin.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);
        console.log(features);

        features = train9ILee.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);
        console.log(features);

        features = train9He.pick(null,null,null,i);
        CenterData();
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);
        console.log(features);

        features = train9JClark.pick(null,null,null,i);
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
    mean_pred_accuracy = (((num_predictions - 1) * mean_pred_accuracy) + (parseInt(result.label)===digitToShow))/num_predictions;
    user_accuracy[digitToShow.toString()] = mean_pred_accuracy
    user_num_pred[digitToShow.toString()] = num_predictions++

    //log n
    //log m
    //log c


    console.log(num_predictions, digitToShow, result.label, additionSwitch, currentEquationDataAddition,currentEquationDataSubtraction);
    //console.log(digitList);
    //console.log(user_accuracy);
    //console.log(user_num_pred);
    //DisplayTextInLowerLeft(result.label);
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
    var R = (1-mean_pred_accuracy) * 255;
    var G = mean_pred_accuracy * 700;

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




    if(G > 255){
        G = 255;
    }

        if (bone.type === 0) {
            stroke(R,G,0);
            strokeWeight(14);
            line(x, y, prevx, prevy);

        }
        if (bone.type === 1) {
            //stroke('rbg(192,192,192)');
            strokeWeight(11);
            line(x, y, prevx, prevy);

        }
        if (bone.type === 2) {
            stroke(R,G,0);
            strokeWeight(8);
            line(x, y, prevx, prevy);

        }
        if (bone.type === 3) {
            stroke(R,G,0);
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