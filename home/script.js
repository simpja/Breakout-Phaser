function gameNavigateClick(player) {
  switch (player) {
    case "game":
      // Redirect user to controller bottom
      window.location = "../game/";
      break;
    case "one":
      // Redirect user to controller bottom
      window.location = "../controllerBottom/";
      break;
    case "two":
      // Redirect user to controller top
      window.location = "../controllerTop/";
      console.log("That's the wrong!");
      break;
  }
}
