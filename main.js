// BUTTONS
let balloon = document.getElementById("balloon")

// #region GAME LOGIC AND DATA

let currentPlayer = {}
let clickCount = 0
let maxClick = 10
let currentPopCount = 0
let gameLength = 10000
let height = 120
let width = 100
let maxSize = 200
let clockId = 0
let timeRemaining = 0

function startGame(){
  document.getElementById("controls").classList.add("hidden")
  document.getElementById("game-content").classList.remove("hidden")
  document.getElementById("scoreboard").classList.add("hidden")
  startClock()
  setTimeout(stopGame, gameLength)
}

function stopGame(){
  document.getElementById("controls").classList.remove("hidden")
  document.getElementById("game-content").classList.add("hidden")
  document.getElementById("scoreboard").classList.remove("hidden")
  height = 120
  width = 100
  clickCount = 0
  if(currentPopCount > currentPlayer.topScore){
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }
  currentPopCount = 0
  stopClock()
  draw()
  drawScoreboard()
}

function startClock(){
  timeRemaining = gameLength/1000
  drawClock()
  clockId = setInterval(drawClock, 1000);
}

function stopClock(){
  clearInterval(clockId)
}

function drawClock(){
  document.getElementById("timer").innerHTML = timeRemaining
  timeRemaining -= 1
}

function inflate(){
  clickCount++
  height += 25
  width += 20
  checkBalloonPop()
  draw()
}

function checkBalloonPop(){
  if(height >= maxSize){
    currentPopCount++
    height = 0
    width = 0
    switch(Math.floor(Math.random()*3)){
      case 0:
        balloon.style.backgroundColor = "#00cf00"
        break
      case 1:
        balloon.style.backgroundColor = "#ff0000"
        break
      case 2:
        balloon.style.backgroundColor = "#00f7ff"
        break
    }
    document.getElementById("pop-sound").play()
  }
}

function draw(){
  balloon.style.height = height+"px"
  balloon.style.width = width+"px"
  document.getElementById("pop-count").innerHTML = currentPopCount
  document.getElementById("click-count").innerHTML = clickCount
  document.getElementById("highscore").innerHTML = currentPlayer.topScore
  document.getElementById("username").innerHTML = currentPlayer.name
}


// #endregion

let players = []
loadPlayers()

function setPlayer(event){
  event.preventDefault()
  let form = event.target
  let playerName = form.playerName.value

  currentPlayer = players.find(player => player.name == playerName)
  if(!currentPlayer){
    currentPlayer = {
      name: playerName,
      topScore: 0
    }
    players.push(currentPlayer)
    savePlayers()
  }
  highestPopCount = currentPlayer.topScore
  document.getElementById("game").classList.remove("hidden")
  form.classList.add("hidden")
  draw()
  drawScoreboard()
  form.reset()
}

function changePlayer(){
  document.getElementById("player-form").classList.remove("hidden")
  document.getElementById("game").classList.add("hidden")
}

function savePlayers(){
window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers(){
  let playersData = JSON.parse(window.localStorage.getItem("players"))
  if(playersData){
    players = playersData
  }
}
 function drawScoreboard(){
  sortPlayers()
  let template = ""
  players.forEach(player => {
    template += `
    <div class="d-flex space-between">
      <span>
        <i class="fa fa-user-circle" aria-hidden="true"></i>
        ${player.name}
      </span>
    <span>Top Score: ${player.topScore}</span>
    </div>
    `
  })
  document.getElementById("players").innerHTML = template
 }
 function sortPlayers(){
  players.sort((p1, p2) => p2.topScore - p1.topScore)
 }

drawScoreboard()