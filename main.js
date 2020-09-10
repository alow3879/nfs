const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  speedValue = document.querySelector('.speedValue'),
  car = document.createElement('div')

car.classList.add('car')

start.addEventListener('click', startGame)
document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
}

const setting = {
  start: false,
  score: 0,
  speed: 30,
  minSpeed: 30,
  maxSpeed: 180,
  sensitivity: 5,
  traffic: 3
}

function getQuantityElements (heightElement) {
  return document.documentElement.clientHeight / heightElement + 1
}

function startRun (event) {
  if (keys[event.key]) {
    event.preventDefault()
  }
  keys[event.key] = true
}

function startGame () {
  gameArea.innerHTML = ''
  start.classList.add('hide')
  gameArea.classList.remove('hide')

  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div')
    line.classList.add('line')
    line.style.top = i * 100 + 'px'
    line.y = i * 100
    gameArea.appendChild(line)
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div')
    enemy.classList.add('enemy')
    enemy.y = -100 * setting.traffic * (i + 1)
    enemy.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px'
    enemy.style.top = enemy.y + 'px'
    enemy.style.background = 'transparent url(./image/enemy.png) center / cover no-repeat'
    gameArea.appendChild(enemy)
  }

  setting.start = true
  gameArea.appendChild(car)
  car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2 + 'px'
  setting.x = car.offsetLeft
  setting.y = car.offsetTop
  requestAnimationFrame(playGame)
}

function playGame () {
  if (setting.start) {
    setting.score += Math.floor(setting.speed * 0.1)
    score.textContent = +setting.score
    moveRoad()
    moveEnemy()
    sensetivity()
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.sensitivity
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.sensitivity
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      if (setting.speed > setting.minSpeed) {
        setting.speed -= 3
      }
      // setting.y += setting.speed
    }
    if (keys.ArrowUp && setting.y > 0) {
      if (setting.speed < setting.maxSpeed) {
        setting.speed += 1
      }
      // setting.y -= setting.speed
    }
    car.style.left = setting.x + 'px'
    car.style.top = setting.y + 'px'
    speedValue.innerText = Math.floor(setting.speed)
    requestAnimationFrame(playGame)
  }
}

function stopRun (event) {
  event.preventDefault()
  keys[event.key] = false
  let interval = setInterval(() => {
    if (setting.speed > setting.minSpeed && keys.ArrowUp === false) {
      setting.speed -= 1
    } else {
      clearInterval(interval)
    }
  }, 100)
}

function moveRoad () {
  let lines = document.querySelectorAll('.line')
  lines.forEach(function(line){
    line.y += setting.speed * 0.1
    line.style.top = line.y + 'px'

    if (line.y > document.documentElement.clientHeight) {
      line.y = -100
    }
  })
}

function moveEnemy () {
  let enemy = document.querySelectorAll('.enemy')
  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect()
    let itemRect = item.getBoundingClientRect()

    if (carRect.top <= itemRect.bottom &&
        carRect.right >= itemRect.left &&
        carRect.left <= itemRect.right &&
        carRect.bottom >= itemRect.top) {
      setting.start = false
      start.classList.remove('hide')
      start.style.top = score.offsetHeight + 'px'
      setting.speed = setting.minSpeed
      setting.score = 0
    }

    item.y += setting.speed * 0.1 / 2
    item.style.top = item.y + 'px'
    if (item.y > document.documentElement.offsetHeight) {
      item.y = -100 * setting.traffic
      item.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px'
    }
  })
}

function sensetivity () {
  if (setting.speed * 0.02 > 5) {
    setting.sensitivity = setting.speed * 0.02
  } else {
    setting.sensitivity = 5
  }
}