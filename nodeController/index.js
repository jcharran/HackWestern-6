require('leapjs/template/entry');
//require('leapjs-plugins');
var https = require('http')
var controller = new Leap.Controller({ enableGestures: true })
// controller.on("frame", function(frame) {
//   console.log("Frame: " + frame.id + " @ " + frame.timestamp);
// });
var isLeft = false;
var isRight = false;
var isStraight = true;
var frameCount = 0;
var isForward = false;
var isBackward = false;
var isStop = false;
var isCircle = false;

function forwardTimeout(){
    setTimeout(() => {
        isForward = false;
    }, 2000);
}
function backwardTimeout() {
    setTimeout(() => {
        isBackward = false;
    }, 2000);
}
controller.on("frame", function(frame){
    if (frame.valid && frame.gestures.length > 0) {
        frame.gestures.forEach(function (gesture) {
            if (gesture.type == "circle" && !isCircle ) {
                    isCircle = true;
                    sendCircle();
                    console.log("Circle Gesture");
            }
        })
    }
})
controller.on("frame", function(frame) {
    if(frame.hands.length > 0)
    {
        var hand = frame.hands[0];
        var position = hand.palmPosition;
        var velocity = hand.palmVelocity;
        var direction = hand.direction;
        //console.log(hand.roll());
        var rollrad = hand.roll();
        var confidence = hand.confidence;
        var confidenceLimit = 0.5;
        if(rollrad > 0.5 && confidence > confidenceLimit) {
            console.log('left', rollrad , hand.confidence);
            if(!isLeft){
                sendLeft();
                isLeft = true;
                isRight = false;
                isStraight= false;

            } 
            
        }
        else if (rollrad < -0.5 && confidence > confidenceLimit) {
            console.log('right', rollrad, hand.confidence);
            if(!isRight){
                sendRight();
                isLeft = false;
                isRight = true;
                isStraight = false;
            }
        }
        else if (confidence > confidenceLimit){
            if(!isStraight){
                isLeft = false;
                isRight = false;
                isStraight = true;
            } 
            console.log('straight', rollrad)
        }
        
        var pitchrad = hand.pitch();
        //console.log(pitchrad);
        if (pitchrad > 0.3){
                if(!isBackward){
                    sendBackward();
                    isBackward = true;
                    isForward = false;
                    isStop = false;
                    backwardTimeout();
                }
                console.log('backward',pitchrad, hand.confidence)
        } else if (pitchrad < -0.5 && confidence > confidenceLimit){
                if(!isForward){
                    sendForward();
                    isForward = true;
                    isBackward = false;
                    isStop = false;
                    forwardTimeout();
                }
                console.log('forward', pitchrad, hand.confidence);
        } else if (confidence > confidenceLimit) {
                console.log('stop', pitchrad, hand.confidence);
                if(!isStop){
                    isStop = true;
                    sendStop();
                }
                
            }
        


    }
    frameCount++;
});

setInterval(function() {
  var time = frameCount/2;
  console.log("received " + frameCount + " frames @ " + time + "fps");
  frameCount = 0;
}, 2000);

controller.on('ready', function() {
    console.log("ready");
});
controller.on('connect', function() {
    console.log("connect");
});
controller.on('disconnect', function() {
    console.log("disconnect");
});
controller.on('focus', function() {
    console.log("focus");
});
controller.on('blur', function() {
    console.log("blur");
});
controller.on('deviceConnected', function() {
    console.log("deviceConnected");
});
controller.on('deviceDisconnected', function() {
    console.log("deviceDisconnected");
});

controller.connect();
console.log("\nWaiting for device to connect...");

function sendForward(){
    https.get('http://localhost:3000/api/forward', (resp)=>{
        resp.on('data', d=>{
            //console.log(d);
        })
    })
}
function sendBackward(){
    https.get('http://localhost:3000/api/back', (resp) => {
        resp.on('data', d => {
            //console.log(d);
        })
    })
}
function sendStop(){
    https.get('http://localhost:3000/api/stop', (resp) => {
        resp.on('data', d => {
            //console.log(d);
        })
    })
}
function sendLeft(){
    https.get('http://localhost:3000/api/left', (resp) => {
        resp.on('data', d => {
            //console.log(d);
        })
    })
}
function sendRight(){
    https.get('http://localhost:3000/api/right', (resp) => {
        resp.on('data', d => {
            //console.log(d);
        })
    })
}

function sendCircle(){
    https.get('http://localhost:3000/api/circle', (resp) => {
        resp.on('data', d => {
            setTimeout(() => {
                isCircle = false;
            }, 10000);
        })
    })
}
