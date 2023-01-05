var grid = document.getElementById("grid");
var testMode = false; //Turn this variable to true to see where the mines are
var sc = document.getElementById("sc");
var showtime = document.getElementById("timer");
var gsize=10
var diff = "easy"
sc.innerHTML=0;
generateGrid();

function generateGrid() {
  //generate 10 by 10 grid
  time=0;
  grid.innerHTML="";
  sc.innerHTML=0;
  for (var i=0; i<gsize; i++) {
    row = grid.insertRow(i);
    for (var j=0; j<gsize; j++) {
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      cell.oncontextmenu = function(e){
        e.preventDefault();
        this.classList.toggle("marked");
      }
      var mine = document.createAttribute("data-mine");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  addMines();
  interval = setInterval(function(){update();}, 100);
}

function update() {
    time += 100;
    showtime.innerHTML = formatTime(time);
}

function formatTime(ms) {
    var hours   = Math.floor(ms / 3600000);
    var minutes = Math.floor((ms - (hours * 3600000)) / 60000);
    var seconds = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);
    var ds = Math.floor((ms - (hours * 3600000) - (minutes * 60000) - (seconds * 1000))/100);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds+'.'+ds;
  }

function addMines() {
  //Add mines randomly
  var ratio=0.1
  if (diff==="easy"){
    ratio =0.1
  }else if(diff==="middle"){
    ratio = 0.25
  }else{
    ratio =0.5
  }
  for (var i=0; i<ratio*gsize*gsize; i++) {
    var row = Math.floor(Math.random() * gsize);
    var col = Math.floor(Math.random() * gsize);
    var cell = grid.rows[row].cells[col];
    cell.setAttribute("data-mine","true");
    if (testMode) cell.innerHTML="X";
  }
}

function revealMines() {
    //Highlight all mines in red
    for (var i=0; i<gsize; i++) {
      for(var j=0; j<gsize; j++) {
        var cell = grid.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true") cell.className="mine";
      }
    }
}

function checkLevelCompletion() {
  var levelComplete = true;
    for (var i=0; i<gsize; i++) {
      for(var j=0; j<gsize; j++) {
        if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
      }
  }
  if (levelComplete) {
    alert("You Win!");
    revealMines();
  }
}

function clickCell(cell) {
  //Check if the end-user clicked on a mine
  if (cell.getAttribute("data-mine")=="true") {
    revealMines();
    alert("Game Over");
    clearInterval(interval);
  } else {
    cell.className="clicked";
    //Count and display the number of adjacent mines
    var mineCount=0;
    sc.innerHTML=parseInt(sc.innerHTML)+1;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    //alert(cellRow + " " + cellCol);
    for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,gsize-1); i++) {
      for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,gsize-1); j++) {
        if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    cell.innerHTML=mineCount;
    if (mineCount==0) { 
      //Reveal all adjacent cells as they do not have a mine
      for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,gsize-1); i++) {
        for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,gsize-1); j++) {
          //Recursive Call
          if (grid.rows[i].cells[j].innerHTML=="") clickCell(grid.rows[i].cells[j]);
        }
      }
    }
    checkLevelCompletion();
  }
}
function setdiff(){
  if(document.getElementById("size").value>0){
    gsize = document.getElementById("size").value;
  }
  diff = document.getElementById("difficult").value;
  generateGrid();
}