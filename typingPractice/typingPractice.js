/**
 * setting up all important global Variables
 */

var correctChars = 0;
var incorrectChars = 0;
var attempts = 0;
var time = 0;
var done = false;

//Today stats
var todaysSets = 0;
var todaysCharsTyped = 0;
var todaysCharsCorrect = 0;
var todaysCharsIncorrect = 0;
var todaystime = 0;

//Total stats
var totalSets = 0;
var totalCharsTyped = 0;
var totalCharsIncorrect = 0;
var totalCharsCorrect = 0;
var totalTime = 0;

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var p_currentTry = document.getElementById("p-currentTry");
var input_length = document.getElementById("input-length");
var p_cpm = document.getElementById("p-cpm");
var p_time = document.getElementById("p-time");
var p_typed = document.getElementById("p-charstyped");
var p_mistyped = document.getElementById("p-charsmistyped");
var div_current_stat = document.getElementById("current-stat");
var borderTop = document.getElementById("border-top");
var textinput = document.getElementById("user-text-input");
var textOutput = document.getElementById("text-output");
var tp_title = document.getElementById("tp-title");
var darkmode = document.getElementById("dark_mode");
var darkmodeDesc = document.getElementById("dark_mode_desc");
var dropdownLetterStats = document.getElementById("dropdown-letters-stats");
var infoDropdownLetterStats = document.getElementById("info-dropdown-letters");
var infoDropdownStats = document.getElementById("info-dropdown");

var resetRunButton = document.getElementById("resetRun");
var setRandomTextButton = document.getElementById("newText");
var deleteRunDataButton = document.getElementById("deleteRunData");
var deleteTodaysDataButton = document.getElementById("deleteTodaysData");
var deleteAllDataButton = document.getElementById("deleteAllData");

var darkmode_bool = false;
var offsetYStats = 0;
var body = document.body;
var mistyped_indicies = [];
var errorCharsAttempts = new Map();
var errorCharsSuccesses = new Map();

var currentFullText = "";
var currentChar = "";
var typedText = "";
var textLeft = "";
var currentIndex = 0;

darkmode.checked = true;

todaysSets = window.localStorage.todaysSets;
todaysCharsTyped = window.localStorage.todaysCharsTyped;
todaysCharsCorrect = window.localStorage.getItem("todaysCharsCorrect");
todaysCharsIncorrect = window.localStorage.getItem("todaysCharsIncorrect");
todaystime = window.localStorage.getItem("todaystime");
errorCharsAttempts = window.localStorage.getItem("errorCharsAttempts");
errorCharsSuccesses = window.localStorage.getItem("errorCharsSuccess");

console.log(errorCharsAttempts, errorCharsSuccesses);

try {
  errorCharsAttempts.has("a");
} catch (error) {
  errorCharsAttempts = new Map();
}

if (errorCharsSuccesses == null) {
  errorCharsSuccesses = new Map();
}

console.log(errorCharsAttempts, errorCharsSuccesses);

console.log(
  todaysSets,
  todaysCharsTyped,
  todaysCharsCorrect,
  todaysCharsIncorrect,
  todaystime,
  window.localStorage.getItem("lastEdited")
);
if (todaysSets == null) {
  todaysSets = 0;
}
if (todaysCharsTyped == null) {
  todaysCharsTyped = 0;
}
if (todaysCharsCorrect == null) {
  todaysCharsCorrect = 0;
}
if (todaysCharsIncorrect == null) {
  todaysCharsIncorrect = 0;
}
if (todaystime == null) {
  todaystime = 0;
}
if (window.localStorage.getItem("lastEdited") != getDate()) {
  todaysSets = 0;
  todaysCharsCorrect = 0;
  todaysCharsIncorrect = 0;
  todaysCharsTyped = 0;
  todaystime = 0;
}

totalSets = window.localStorage.getItem("totalSets");
totalCharsCorrect = window.localStorage.getItem("totalCharsCorrect");
totalCharsIncorrect = window.localStorage.getItem("totalCharsIncorrect");
totalCharsTyped = window.localStorage.getItem("totalCharsTyped");
totalTime = window.localStorage.getItem("totalTime");

if (totalSets == null) {
  totalSets = 0;
}
if (totalCharsCorrect == null) {
  totalCharsCorrect = 0;
}
if (totalCharsIncorrect == null) {
  totalCharsIncorrect = 0;
}
if (totalCharsTyped == null) {
  totalCharsTyped = 0;
}
if (totalTime == null) {
  totalTime = 0;
}

/**
 * util Methods
 */
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

function setText(string) {
  currentFullText = String(string);
  currentFullText = replaceAll(currentFullText, ",", " ");
  //currentFullText = "<span>Some text</span>";
  currentIndex = 0;
  textLeft = currentFullText.substring(1);
  typedText = "";
  currentChar = currentFullText.charAt(0);
  textOutput.innerHTML =
    '<p id="text-output"><span style="color:rgb(0,255,0)">' +
    typedText +
    '</span><span style="color:orange">' +
    currentChar +
    '</span><span style="color:rgb(220,220,220)">' +
    textLeft +
    "</span></p>";
  setSizes();
}

function getDate() {
  var currentdate = new Date();
  return (datetime =
    "Last Sync: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear());
}

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function setRandomText() {
  mistyped_indicies = [];
  done = false;
  fetch(
    "https://random-word-api.herokuapp.com/word?number=" + input_length.value
  )
    .then((response) => response.json())
    .then((response) => setText(response));
}

function setCurrentTryData(cpm, time, charstyped, charsmistyped) {
  p_cpm.textContent = "CPM:            " + cpm + "CPM";
  p_time.textContent = "Time: " + msToTime(time);
  p_typed.textContent = "chars typed:    " + charstyped;
  p_mistyped.textContent = "chars mistyped: " + charsmistyped;
  setSizes();
}

function getTimeInMS() {
  //console.log(time * 10);
  return time * 10;
}

function setSizes() {
  window.localStorage.todaysSets = todaysSets;
  window.localStorage.todaysCharsTyped = todaysCharsTyped;
  window.localStorage.todaysCharsCorrect = todaysCharsCorrect;
  window.localStorage.todaysCharsIncorrect = todaysCharsIncorrect;
  window.localStorage.todaystime = todaystime;
  window.localStorage.lastEdited = getDate();

  window.localStorage.totalSets = totalSets;
  window.localStorage.totalCharsCorrect = totalCharsCorrect;
  window.localStorage.totalCharsIncorrect = totalCharsIncorrect;
  window.localStorage.totalCharsTyped = totalCharsTyped;
  window.localStorage.totalTime = totalTime;

  window.localStorage.errorCharsAttempts = errorCharsAttempts;
  window.localStorage.errorCharsSuccesses = errorCharsSuccesses;

  var leftOffset = windowWidth - 300;
  tp_title.style.left = (windowWidth - 500) / 2 + "px";
  tp_title.style.top = "-40px";
  tp_title.style.width = "500px";
  tp_title.style.textAlign = "center";
  tp_title.style.fontSize = "40px";
  tp_title.style.textDecoration = "underline";

  p_currentTry.textContent = "Current Try";
  p_currentTry.style.textDecoration = "underline";
  p_currentTry.style.left = windowWidth - 200 + "px";
  p_currentTry.style.top = offsetYStats - 20 + "px";

  p_currentTry.style.left = leftOffset + "px";
  p_currentTry.style.top = offsetYStats - 20 + "px";

  p_cpm.style.left = leftOffset + "px";
  p_cpm.style.top = offsetYStats + "px";

  p_time.style.left = leftOffset + "px";
  p_time.style.top = offsetYStats + 20 + "px";

  p_typed.style.left = leftOffset + "px";
  p_typed.style.top = offsetYStats + 40 + "px";

  p_mistyped.style.left = leftOffset + "px";
  p_mistyped.style.top = offsetYStats + 60 + "px";

  borderTop.style.width = windowWidth - 20 + "px";
  borderTop.style.top = offsetYStats + 120 + "px";

  darkmode.style.left = leftOffset + "px";
  darkmode.style.top = offsetYStats + 100 + "px";
  darkmodeDesc.style.left = leftOffset + 20 + "px";
  darkmodeDesc.style.top = offsetYStats + 85 + "px";
  darkmodeDesc.style.color = "rgb(220,220,220)";

  textinput.style.left = "100px";
  textinput.style.width = windowWidth - 200 + "px";
  textinput.style.textAlign = "center";
  textinput.style.caretColor = "rgb(120,120,120)";
  textinput.style.top = 150 + offsetYStats + "px";

  textOutput.style.position = "absolute";
  textOutput.style.top = 120 + offsetYStats + "px";
  textOutput.style.left = "110px";
  textOutput.style.width = windowWidth - 200 + "px";
  textOutput.style.height = "20px";
  textOutput.style.maxWidth = windowWidth - 200 + "px";
  textOutput.style.fontSize = "20px";

  resetRunButton.style.position = "absolute";
  resetRunButton.style.top = "480px";
  resetRunButton.style.left = "100px";
  resetRunButton.style.height = "40px";
  resetRunButton.style.width = "100px";
  resetRunButton.style.backgroundColor = "rgb(120,120,120)";

  setRandomTextButton.style.position = "absolute";
  setRandomTextButton.style.top = "480px";
  setRandomTextButton.style.left = "250px";
  setRandomTextButton.style.height = "40px";
  setRandomTextButton.style.width = "100px";
  setRandomTextButton.style.backgroundColor = "rgb(120,120,120)";

  deleteRunDataButton.style.position = "absolute";
  deleteRunDataButton.style.top = "480px";
  deleteRunDataButton.style.left = "400px";
  deleteRunDataButton.style.height = "40px";
  deleteRunDataButton.style.width = "100px";
  deleteRunDataButton.style.backgroundColor = "rgb(120,120,120)";

  deleteAllDataButton.style.position = "absolute";
  deleteAllDataButton.style.top = "480px";
  deleteAllDataButton.style.left = "550px";
  deleteAllDataButton.style.height = "40px";
  deleteAllDataButton.style.width = "100px";
  deleteAllDataButton.style.backgroundColor = "rgb(120,120,120)";

  deleteTodaysDataButton.style.position = "absolute";
  deleteTodaysDataButton.style.top = "480px";
  deleteTodaysDataButton.style.left = "700px";
  deleteTodaysDataButton.style.height = "40px";
  deleteTodaysDataButton.style.width = "100px";
  deleteTodaysDataButton.style.backgroundColor = "rgb(120,120,120)";

  var html = "";
  for (var counter = 97; counter <= 122; counter++) {
    var currentC = String.fromCharCode(counter);
    var string_stats_letters =
      currentC +
      ": " +
      Math.floor(
        (errorCharsSuccesses.get(currentC) / errorCharsAttempts.get(currentC)) *
          1000
        //(errorCharsSuccesses.get(currentC) / 1) * 1000
      ) /
        10 +
      "% \n";
    html =
      html +
      '<p style="color: rgb(220,220,220)">' +
      string_stats_letters +
      "</p>";
  }
  html = replaceAll(html, "NaN", "???");
  infoDropdownLetterStats.innerHTML = html;
  //console.log(time);
  html = "";
  for (var counter = 0; counter <= 19; counter++) {
    var stringToView = "";
    var item = 0;
    if (counter == item) {
      stringToView = "Stats";
    }
    item++;
    if (counter == item) {
      stringToView = "<u>Last set:</u>";
    }
    item++;
    if (counter == item) {
      stringToView = " - Time: " + msToTime(getTimeInMS());
    }
    item++;
    if (counter == item) {
      stringToView =
        " - CPM: " + Math.floor((attempts / time) * 10000) / 10 + "CPM";
    }
    item++;
    if (counter == item) {
      stringToView =
        " - Wrong Chars: " +
        Math.floor((incorrectChars / attempts) * 1000) / 10 +
        "%";
    }
    item++;
    if (counter == item) {
      stringToView = "";
    }
    item++;
    if (counter == item) {
      stringToView = "<u>Today</u>";
    }
    item++;
    if (counter == item) {
      stringToView = " - Sets: " + todaysSets;
    }
    item++;
    if (counter == item) {
      stringToView = " - Chars typed: " + todaysCharsTyped;
    }
    item++;
    if (counter == item) {
      stringToView =
        " - Average CPM: " +
        Math.floor((todaysCharsTyped / todaystime) * 10 * 1000) / 10 +
        "CPM";
    }
    item++;
    if (counter == item) {
      stringToView = " - Total time: " + msToTime(todaystime * 10);
    }
    item++;
    if (counter == item) {
      stringToView =
        " - Mistake ratio: " +
        Math.floor((todaysCharsIncorrect / todaysCharsTyped) * 1000) / 10 +
        "%";
    }
    item++;
    if (counter == item) {
      stringToView = "";
    }
    item++;
    if (counter == item) {
      stringToView = "<u>Total</u>";
    }
    item++;
    if (counter == item) {
      stringToView = " - Sets: " + totalSets;
    }
    item++;
    if (counter == item) {
      stringToView = " - Chars typed: " + totalCharsTyped;
    }
    item++;
    if (counter == item) {
      stringToView =
        " - Average CPM: " +
        Math.floor((totalCharsTyped / totalTime) * 10 * 1000) / 10;
    }
    item++;
    if (counter == item) {
      stringToView = " - Total time: " + msToTime(totalTime * 10);
    }
    item++;
    if (counter == item) {
      stringToView =
        " - Mistake ratio: " +
        Math.floor((totalCharsIncorrect / totalCharsTyped) * 1000) / 10 +
        "%";
    }
    item++;
    html = html + '<p style="color: rgb(220,220,220)">' + stringToView + "</p>";
  }
  html = replaceAll(html, "NaN", "???");
  infoDropdownStats.innerHTML = html;
  //infoDropdownStats.innerHTML = html;

  darkmode_bool = darkmode.checked;

  if (darkmode_bool) {
    body.style.backgroundColor = "rgb(50,50,50)";
    textinput.style.backgroundColor = "rgb(120,120,120)";
    p_cpm.style.color = "rgb(220,220,220)";
    p_currentTry.style.color = "rgb(220,220,220)";
    p_mistyped.style.color = "rgb(220,220,220)";
    p_time.style.color = "rgb(220,220,220)";
    p_typed.style.color = "rgb(220,220,220)";
    darkmodeDesc.style.color = "rgb(220,220,220)";
    tp_title.style.color = "rgb(220,220,220)";
  } else {
    body.style.backgroundColor = "white";
    p_cpm.style.color = "black";
    textinput.style.backgroundColor = "rgb(220,220,220)";
    p_currentTry.style.color = "black";
    p_mistyped.style.color = "black";
    p_time.style.color = "black";
    p_typed.style.color = "black";
    darkmodeDesc.style.color = "black";
    tp_title.style.color = "black";
  }
}

function resetRun() {
  setRandomText();
  time = 0;
  correctChars = 0;
  incorrectChars = 0;
  attempts = 0;
  setSizes();
}
function deleteTodaysData() {
  totalCharsCorrect = totalCharsCorrect - todaysCharsTyped;
  totalCharsIncorrect = totalCharsIncorrect - todaysCharsIncorrect;
  totalCharsTyped = totalCharsTyped - todaysCharsTyped;
  totalSets = totalSets - todaysSets;
  totalTime = totalTime - todaystime;
  todaysCharsCorrect = 0;
  todaysCharsIncorrect = 0;
  todaysCharsTyped = 0;
  todaysSets = 0;
  todaystime = 0;
  setSizes();
}
function deleteAllData() {
  todaysCharsCorrect = 0;
  todaysCharsIncorrect = 0;
  todaysCharsTyped = 0;
  todaysSets = 0;
  todaystime = 0;
  totalCharsCorrect = 0;
  totalCharsIncorrect = 0;
  totalCharsTyped = 0;
  totalSets = 0;
  totalTime = 0;
  window.localStorage.clear();
  setSizes();
}
function deleteRunData() {
  totalCharsCorrect = totalCharsCorrect - charstyped;
  totalCharsIncorrect = totalCharsIncorrect - charsmistyped;
  totalCharsTyped = totalCharsTyped - attempts;
  totalSets = totalSets - 1;
  totalTime = totalTime - time;
  todaysCharsCorrect = todaysCharsCorrect - charstyped;
  todaysCharsIncorrect = todaysCharsIncorrect - charsmistyped;
  todaysCharsTyped = todaysCharsTyped - attempts;
  todaysSets = todaysSets - 1;
  todaystime = todaystime - time;
  setSizes();
}

darkmode.addEventListener("click", (event) => {
  setSizes();
});

/**
 * setting up window
 */

setSizes();
setRandomText();
setCurrentTryData(0, 120000, 0, 0);
/**
 * all events
 */

input_length.addEventListener("click", (event) => {
  setRandomText();
});

function infoClick() {
  document.getElementById("info-dropdown").classList.toggle("show");
}
function infoByLetterClick() {
  document.getElementById("info-dropdown-letters").classList.toggle("show");
}
window.onclick = function (event) {
  if (!event.target.matches(".info-dropdown-button")) {
    var dropdowns = document.getElementsByClassName("info-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
  if (!event.target.matches(".info-dropdown-button-letter")) {
    var dropdowns = document.getElementsByClassName(
      "info-dropdown-content-letter"
    );
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

textinput.addEventListener("keydown", function (e) {
  done = true;
  e.preventDefault();

  if (currentIndex >= currentFullText.length && !(e.key == "Enter")) {
    return;
  }

  if (!errorCharsAttempts.has(e.key)) {
    errorCharsAttempts.set(e.key, 0);
  }
  if (!errorCharsSuccesses.has(e.key)) {
    errorCharsSuccesses.set(e.key, 0);
  }

  var lastCharWrong = true;

  lastCharWrong = e.key == currentFullText.charAt(currentIndex);
  attempts++;
  todaysCharsTyped++;
  totalCharsTyped++;
  errorCharsAttempts.set(e.key, errorCharsAttempts.get(e.key) + 1);
  if (lastCharWrong) {
    currentIndex++;
    currentChar = currentFullText.charAt(currentIndex);
    typedText = typedText + e.key;
    textLeft = currentFullText.substring(currentIndex + 1);
    correctChars++;
    todaysCharsCorrect++;
    totalCharsCorrect++;
    errorCharsSuccesses.set(e.key, errorCharsSuccesses.get(e.key) + 1);
  } else {
    incorrectChars++;
    totalCharsIncorrect++;
    todaysCharsIncorrect++;
    mistyped_indicies[currentIndex] = "error";
  }
  if (e.keyCode == 37 || e.keyCode == 39) e.preventDefault();

  var innerHtml = '<p id="text-output">';
  for (var counter = 0; counter < currentFullText.length; counter++) {
    if (mistyped_indicies[counter] == "error") {
      if (counter == currentIndex) {
        innerHtml =
          innerHtml +
          '<u style="text-decoration-color:rgb(255,0,0)"><span style="color:rgb(255,0,0)">' +
          currentFullText.charAt(counter) +
          "</span></u>";
      } else {
        innerHtml =
          innerHtml +
          '<span style="color:rgb(200,0,0)">' +
          currentFullText.charAt(counter) +
          "</span>";
      }
    } else {
      if (counter == currentIndex) {
        innerHtml =
          innerHtml +
          '<u style="text-decoration-color:rgb(255,200,0)"><span style=" color:rgb(255,200,0)">' +
          currentFullText.charAt(counter) +
          "</span></u>";
      } else if (counter < currentIndex) {
        innerHtml =
          innerHtml +
          '<span style="color:rgb(0,200,0)">' +
          currentFullText.charAt(counter) +
          "</span>";
      } else {
        innerHtml =
          innerHtml +
          '<span style="color:rgb(220,220,220)">' +
          currentFullText.charAt(counter) +
          "</span>";
      }
    }
  }
  innerHtml = innerHtml + "</p>";
  setSizes();
  textOutput.innerHTML = innerHtml;
  if (currentIndex >= currentFullText.length) {
    todaysSets++;
    totalSets++;
    done = false;
  }
  if (currentIndex >= currentFullText.length && e.key == "Enter") {
    currentIndex = 0;
    setRandomText();
    done = false;
  }
});

/**
 * timer
 */

setInterval(incrementTimer, 10);

var lastIndex = 0;
var lastStatus = done;
function incrementTimer() {
  if (!lastStatus) {
    if (done) {
      time = 0;
    }
  }
  lastStatus = done;
  if (done) {
    time++;
    todaystime++;
    totalTime++;
  }
  if (currentIndex > 0) {
    lastIndex = currentIndex;
    setCurrentTryData(
      Math.floor((attempts / time) * 10000) / 10,
      time * 10,
      correctChars,
      incorrectChars
    );
  } else {
    if (lastIndex > 0) {
      setCurrentTryData(
        Math.floor((lastIndex / time) * 10000) / 10,
        time * 10,
        correctChars,
        incorrectChars
      );
    } else {
      setCurrentTryData("0", time * 10, correctChars, incorrectChars);
    }
  }
}
