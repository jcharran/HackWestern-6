window.onload = function () {

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
let endpoint = 'https://loud-eagle-9.localtunnel.me/api'
var toggleForW = 0;

let wbutton = document.getElementById("W");
wbutton.addEventListener("touchstart", function(){
  console.log('forward')
  httpGet(endpoint + '/forward')
})


wbutton.addEventListener("touchend", function(){
  httpGet(endpoint + '/stop')
  console.log('stop')

})

let abutton = document.getElementById("A");
abutton.addEventListener("touchstart", function(){
  console.log('left')
  httpGet(endpoint + '/goLeft')
})


abutton.addEventListener("touchend", function(){
  httpGet(endpoint + '/straight')
  console.log('straight')

})


let sbutton = document.getElementById("S");
sbutton.addEventListener("touchstart", function(){
  console.log('back')
  httpGet(endpoint + '/back')
})


sbutton.addEventListener("touchend", function(){
  httpGet(endpoint + '/stop')
  console.log('stop')

})


let dbutton = document.getElementById("D");
dbutton.addEventListener("touchstart", function(){
  console.log('right')
  httpGet(endpoint + '/goRight')
})


dbutton.addEventListener("touchend", function(){
  httpGet(endpoint + '/straight')
  console.log('straight')

})

let dancebutton = document.getElementById("dance");
dancebutton.addEventListener("touchstart", function(){
  console.log('dance')
  httpGet(endpoint + '/dance')
})

let passengerbutton = document.getElementById("passenger");
passengerbutton.addEventListener("touchstart", function(){
  console.log('passenger')
  passengerbutton.classList.toggle('active')

  httpGet(endpoint + '/openPassengerDoor')
})

let driverbutton = document.getElementById("driver");
driverbutton.addEventListener("touchstart", function(){
  console.log('driver')
  driverbutton.classList.toggle('active')
  httpGet(endpoint + '/openDriverDoor')
})



function keyDown(e){
  console.log(e);
  if (e.key.toUpperCase() == "W"){
    document.getElementById("W").classList.toggle('active')
    httpGet(endpoint + '/forward')
  }
  if (e.key.toUpperCase() == "A"){
    document.getElementById("A").classList.toggle('active')
    httpGet(endpoint + '/goLeft')

  }
  if (e.key.toUpperCase() == "S"){
    document.getElementById("S").classList.toggle('active')
    httpGet(endpoint + '/back')
  }
  if (e.key.toUpperCase() == "D"){
    document.getElementById("D").classList.toggle('active')
    httpGet(endpoint + '/goRight')

  }
}

function keyUp(e){
  if (e.key.toUpperCase() == "W"){
    document.getElementById("W").classList.toggle('active')
    httpGet(endpoint + '/stop')
  }
  if (e.key.toUpperCase() == "A"){
    document.getElementById("A").classList.toggle('active')
    httpGet(endpoint + '/straight')

  }
  if (e.key.toUpperCase() == "S"){
    document.getElementById("S").classList.toggle('active')
    httpGet(endpoint + '/straight')
  }
  if (e.key.toUpperCase() == "D"){
    document.getElementById("D").classList.toggle('active')
    httpGet(endpoint + '/stop')

  }
  if (e.key.toUpperCase() == "F"){
    document.getElementById("dance").classList.toggle('active')
    httpGet(endpoint + '/dance')

  }
  if (e.key.toUpperCase() == "G"){
    document.getElementById("passenger").classList.toggle('active')
    httpGet(endpoint + '/openPassengerDoor')

  }
  if (e.key.toUpperCase() == "H"){
    document.getElementById("driver").classList.toggle('active')
    httpGet(endpoint + '/openDriverDoor')

  }
}




function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true ); // false for synchronous request
    xmlHttp.setRequestHeader('Access-Control-Allow-Origin', 'https://web-car-controller.firebaseapp.com');
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
}