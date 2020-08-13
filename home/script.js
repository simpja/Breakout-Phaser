var header = document.getElementById("header");
header.addEventListener("click", clickHeader);

function clickHeader() {
  console.log(window.location);
  window.location = "../home/";
}

function gameNavigateClick(player) {
  switch (player) {
    case "game":
      // Redirect user to game page
      window.location = "../addGame/";
      break;
    case "controller":
      // Redirect user to controller page
      window.location = "../controller/";
      break;
    case "instructions":
      window.location = "../instructions/";
      break;
  }
}
