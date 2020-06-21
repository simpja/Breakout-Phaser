var header = document.getElementById("header");
header.addEventListener("click", clickHeader);

function clickHeader() {
  console.log(window.location);
  window.location = "../";
}
