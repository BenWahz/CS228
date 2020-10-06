const knnClassifier = ml5.KNNClassifier();

var numSamples = train9.shape[0];
//var numFeatures = (train9.shape[1])-1;

var testingSampleIndex = 0;


var predictedClassLabels = nj.zeros([numSamples]);

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
    for(var i = 0; i < train9.shape[3]; i++)
    {
        var features = train9.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);

        features = train1.pick(null,null,null,i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);


        //console.log(features);



        //console.log(features);
    }


    trainingCompleted = true;
}

function Test()
{
    //console.log("I am testing");
    for(var i = 0; i < 2; i++)
    {
        var currentTestingSample = test.pick(null,null,null,i);
        currentTestingSample = currentTestingSample.reshape(120).tolist();
        //var currentLabel = test.get(testingSampleIndex,-1); //classLabel
        var predictedLabel = knnClassifier.classify(currentTestingSample, GotResults);

        //console.log(currentTestingSample);
    }

}

function GotResults(err, result)
{
    predictedClassLabels[err] = parseInt(result.label);
    testingSampleIndex++;
    if (testingSampleIndex > numSamples)
    {
        testingSampleIndex = 0;
    }
    console.log(parseInt(result.label));
}

//draw();