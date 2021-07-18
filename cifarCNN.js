// source https://gist.github.com/cyphunk/6c255fa05dd30e69f438a930faeb53fe
function softmax(arr) {
  return arr.map(function(value,index) { 
    return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
  })
}

function preprocessImage(image) {
  // TODO change the target size in resize function to your model's input size
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([32, 32])
		.toFloat();
	return tensor.div(255)
			.expandDims();
}

async function cifarCNN_makePrediction() {
  console.log('Loading model..');  
  // TODO change the classes' dictionary based on what is the output of your model
  const classes = {
    0:'airplane',
    1:'automobile',
    2:'bird',
    3:'cat',
    4:'deer',
    5:'dog',
    6:'frog',
    7:'horse',
    8:'ship',
    9:'truck'
  }

  // Load the model.
  var model = undefined;
  // TODO switch the link for your own model link
  model = await tf.loadLayersModel('https://raw.githubusercontent.com/davidcechak/eccb21_tf.js/main/assets/cnn_cifar/model.json');
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('img');
  const result = await model.predict(preprocessImage(imgEl));
  var result_pred = result.dataSync();
  console.log('Prediction done');


  // TODO change the format of your output if necessary 
  var pred = document.getElementById('cifarCNN_pred');
  result_pred = softmax(result_pred)
  const result_prob = Math.max(...result_pred)
  const result_class = result_pred.indexOf(result_prob)

  const output = "".concat("<b>Output:</b><br/><br/>The predicted class is <b>", classes[result_class], '</b> with the probability <b>', result_prob,'</b> <br/><br/><br/>');

  pred.innerHTML = output

  return(classes[result_class]);
}

// HTML5 image file reader 
if (window.FileReader) {
  function handleFileSelect(evt) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          document.getElementById('image').innerHTML = ['<img id="img" crossorigin src="', e.target.result,'" title="', theFile.name, '" width="227"/>'].join('');
        };
      })(f);

      reader.readAsDataURL(f);
  }
} else {
  alert('This browser does not support FileReader');
}

// listener for a new image
document.getElementById('files').addEventListener('change', handleFileSelect, false);
