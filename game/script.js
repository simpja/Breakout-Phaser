var canvas = document.querySelector("canvas");
var body = document.querySelector("body");

var header = document.getElementById("header");
header.addEventListener("click", clickHeader);

var instructionsDiv = document.getElementById("instructions-div-second");
/*
var lowerInstructionsDiv = instructionsDiv.valueOf();
console.log(lowerInstructionsDiv);
lowerInstructionsDiv.innerHTML = "<h1> OH FUCK </h1>";

// canvas.insertBefore(lowerInstructionsDiv);
*/
setTimeout(() => {
  body.appendChild(instructionsDiv);
}, 500);

// take instructions div
// replace &#8679 with &#8680
// replace &#8681 with &#8678

function clickHeader() {
  console.log(window.location);
  window.location = "../home/";
}
