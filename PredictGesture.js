const knnClassifier = ml5.KNNClassifier();

// var numSamples = irisData.shape[0];
// var numFeatures = (irisData.shape[1])-1;

var testingSampleIndex = 1;

var trainingCompleted = false;

//var predictedClassLabels = nj.zeros([numSamples]);


function draw()
{
    clear();
    if (trainingCompleted == false)
    {
        Train();
    }

    Test();
    
    // console.log(irisData.toString());
    // console.log(numSamples);
    // console.log(numFeatures);
}


function Train()
{
    console.log("I am being trained")
    for(var i = 0; i < train0.shape[3]; i++)
    {
        var features = train0.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);

        console.log(features.toString());
    }


    trainingCompleted = true;
}

function Test()
{

    console.log("I am testing");
}



//draw();