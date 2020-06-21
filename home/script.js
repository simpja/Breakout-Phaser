var header = document.getElementById("header");
header.addEventListener("click", clickHeader);

function clickHeader() {
  console.log(window.location);
  window.location = "../home/";
}

function gameNavigateClick(player) {
  switch (player) {
    case "game":
      // Redirect user to controller bottom
      window.location = "../game/";
      break;
    case "two":
      // Redirect user to controller top
      window.location = "../controller/";
      break;
    case "instructions":
      window.location = "../instructions/";
      break;
  }
}
