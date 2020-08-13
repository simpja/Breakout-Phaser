// var canvas = document.querySelector("canvas");
var body = document.querySelector("body");

var header = document.getElementById("header");
header.addEventListener("click", clickHeader);

var instructionsDiv = document.getElementById("instructions-div-second");
var score = document.getElementById("scoreShow");
var gameNameShow = document.getElementById("nameShow");

// Function to fetch URL parameters
var getParams = function(url) {
  var params = {};
  var parser = document.createElement("a");
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

// We get the gameName sent from the previous addGame page as a URL param
var URLParameters = getParams(window.location.href);

async function fetchGame(gameName) {
  await fetch(`/getGame?gameName=${gameName}`)
    .then((res) => {
      if (res.status !== 200) {
        console.log(
          `Couldn't retrieve the highscore. API responded: ${res.status}`
        );
        return;
      }
      res.json().then((data) => {
        score.innerHTML = `${data.scoreTop} - ${data.scoreBottom}`;
        gameNameShow.innerHTML = data.name;
      });
    })
    .catch((err) => {
      console.log(`fetch score error: ${err.message}`);
    });
  // Have to get the current score of the given game
  // Must write that route and function on server, then call it using fetch
}

// Fikset feil med at ulike ting loadet på ulike tidspunkt og ikke endte opp i hverandre som ønsket.
setTimeout(() => {
  body.appendChild(instructionsDiv);
  fetchGame(URLParameters.gameName);
}, 500);

// take instructions div
// replace &#8679 with &#8680
// replace &#8681 with &#8678

function clickHeader() {
  console.log(window.location);
  window.location = "../home/";
}
