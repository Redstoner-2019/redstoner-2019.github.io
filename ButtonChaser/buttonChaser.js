var button = document.querySelector(".button-to-chase");
var buttonContainer = document.querySelector(".button-container");
button.style.left = 0 + "px";
button.style.top = 0 + "px";
var windowX = window.innerWidth;
var windowY = window.innerHeight;
var buttonX = windowX / 2;
var buttonY = windowY / 2;
var stopAtEdges = true;
var buttonWidth = button.clientWidth;
var buttonHeight = button.clientHeight;

function moveButton() {
  var y = buttonY - 910;
  var x = buttonX - 50;
  buttonContainer.style.left = x + "px";
  buttonContainer.style.top = y + "px";
}

moveButton();

window.addEventListener("mousemove", (event) => {
  windowX = window.innerWidth;
  windowY = window.innerHeight;

  var mouseX = event.clientX;
  var mouseY = event.clientY;

  var distanceX = buttonX - mouseX;
  var distanceY = buttonY - mouseY;

  var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  distanceY = Math.abs(distanceY);
  distanceX = Math.abs(distanceX);

  distanceX = distanceX / distance;
  distanceY = distanceY / distance;

  var speed = 200 / distance;
  if (distance < 200) {
    speed = 200 / Math.exp(2, distance);
  }
  if (distance > 400) {
    speed = 0;
  }

  if (mouseY < buttonY) {
    buttonY = buttonY + speed * distanceY;
  }
  if (mouseY > buttonY) {
    buttonY = buttonY - speed * distanceY;
  }
  if (mouseX < buttonX) {
    buttonX = buttonX + speed * distanceX;
  }
  if (mouseX > buttonX) {
    buttonX = buttonX - speed * distanceX;
  }

  if (stopAtEdges) {
    if (buttonX < buttonWidth / 2) {
      buttonX = buttonWidth / 2;
    }
    if (buttonY < buttonHeight) {
      buttonY = buttonHeight;
    }
    if (buttonX > windowX - buttonWidth / 2) {
      buttonX = windowX - buttonWidth / 2;
    }
    if (buttonY > windowY) {
      buttonY = windowY;
    }
  } else {
    if (buttonX < buttonWidth || buttonX > windowX) {
      buttonX = windowX / 2;
    }
    if (buttonY < buttonHeight || buttonY > windowY) {
      buttonY = windowY / 2;
    }
  }

  moveButton();
});
button.addEventListener("mouseover", (event) => {
  buttonX = windowX / 2;
  buttonY = windowY / 2;
  moveButton();
});
