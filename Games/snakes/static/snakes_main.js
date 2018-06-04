function startGame() {
    document.addEventListener("mousemove", getMouseX);
    var mouseX;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;
    var gameUnit = 50;
    var gameRefreshRate = 10;
    var globalGameSpeed = 3;
    var canvasOriginY = 0

    var player = { x: canvas.width * .499, y: canvas.height * 0.8, r: gameUnit / 2, num:10 }
    var playerSpeed = 10;
    var blockers = new Array();
    var foods = new Array();
    
    var strokeWidth = 1;
    var strokeColor = 'black';
    var scrollingSwitch = true;

    //game loop
    makeObstacles();
    makeFood();
    window.setInterval(function () {
        ctx.clearRect(0, canvasOriginY, canvas.width, canvas.height);
        if (scrollingSwitch == true) {
            moveObstacles();
            moveFood();
            if (blockers[i].y > canvasHeight) { // reset blocker
                makeObstacles();
                makeFood();
            }
        }

        player.x = getPlayerX(mouseX, playerSpeed, player.x);
        collisionHandler();
        drawPlayer();
        drawObstacles(event);
        drawFoods();

    }, gameRefreshRate);


    function drawPlayer() {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        //number
        ctx.font = "30px Arial";
        ctx.fillStyle = 'red';
        ctx.textAlign="center";
        ctx.fillText(player.num, player.x, player.y+player.r/2);
    }

    /////////////obstacles////
    function makeObstacles(){
        blockers = new Array();
        for (i=0; i<4;i++){
            var xPos = canvasWidth * (i*.25);
            var yPos = 0;
            var width = gameUnit*2;
            var height = gameUnit;
            var number = getRndInteger (1,10);
            blockers.push({x:xPos,y:yPos,w:width,h:height,num:number});
        }
    }

    function moveObstacles(){
        for (i = 0; i<blockers.length; i++){
            blockers[i].y += globalGameSpeed;

        }
    }

    function drawObstacles() {
        blockers.forEach(function (element) {
            //shape
            ctx.beginPath();
            if(element.num <= 0){
                element.x = canvasWidth + gameUnit
            }
            ctx.rect(element.x, element.y, element.w, element.h);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
            //number
            ctx.font = "30px Arial";
            ctx.fillStyle = 'red';
            ctx.textAlign="center";
            ctx.fillText(element.num, element.x+element.w/2, element.y+element.h*.75);
        })
    }

    /////////////foods////
    function makeFood(minX = 25, maxX = canvasWidth, minY = canvasOriginY - 100, maxY = canvasOriginY - 600, minNum=1, maxNum=10) {
        var radius = gameUnit/4;
        var xPos = getRndInteger(minX, maxX);
        var yPos = getRndInteger(minY, maxY);
        var num = getRndInteger(minNum, maxNum);
        console.log(num);
        var food = {x:xPos,y:yPos,r:radius ,num:num};
        foods.push(food);
    }

    function moveFood(){
        var indexToRemove = -1;
        for (i = 0; i<foods.length; i++){
            foods[i].y += globalGameSpeed;
            if(foods[i].y>canvasHeight){
                indexToRemove = i;
            }
        }
        if(indexToRemove>-1){
            foods.splice(indexToRemove,1);
        }
    }

    function drawFoods(){
        foods.forEach(function (food) {
            //shape
            ctx.beginPath();
            ctx.arc(food.x, food.y, food.r, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
            //number
            ctx.font = "30px Arial";
            ctx.fillStyle = 'red';
            ctx.textAlign="center";
            ctx.fillText(food.num, food.x, food.y-gameUnit/3);
        })
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }


    // return true if the rectangle and circle are colliding
    var timeSinceLastCollision = 0;
    function collisionHandler() {
        //blockers
        for (i = 0; i < blockers.length; i++) {
            if (isCollidingWithBlocker(player, blockers[i])) {
                scrollingSwitch = false;
                timeSinceLastCollision += 1;
                if (timeSinceLastCollision > 10){
                    blockers[i].num -= 1;
                    player.num -=1;
                    timeSinceLastCollision = 0;
                }
                return;
            }
            scrollingSwitch = true;
        }

        //fodd
        for (i = 0; i < foods.length; i++) {
            if (isCollidingWithFood(player, foods[i])) {
                player.num += foods[i].num;
                foods.splice(i,1);
            }
        }
    }

    function isCollidingWithBlocker(circle, blocker) {
        var distY = (circle.y - circle.r) - (blocker.y + blocker.h);
        var escapeY = -circle.r - blocker.h;
        if (distY <= 0 && distY >= -globalGameSpeed) { // if blocker is coming contact with the circle then check the x distance
            var blockerLeft = blocker.x;
            var blockerRight = blocker.x + blocker.w
            if (circle.x > blockerLeft && circle.x < blockerRight) {
                return true;
            }
        }
        if (distY < -globalGameSpeed && distY >= escapeY) { // if circle is paralle to rect
            if (circle.x < blocker.x) { // if circle is on the left side of blocker
                if (circle.x > blocker.x - circle.r) {
                    circle.x = blocker.x - circle.r;
                }
            } else {// if circle is on the right side of blocker
                if (circle.x < blocker.x + blocker.w + circle.r) {
                    circle.x = blocker.x + blocker.w + circle.r
                }
            }
        }
        return false;
    }

    
    function isCollidingWithFood(circle, food) {
        var distY = Math.abs(circle.y - food.y) ;
        var escapeDistance = circle.r + food.r;
        if (distY < escapeDistance) { // if blocker is coming contact with the circle then check the x distance
            distX = Math.abs(circle.x - food.x);
            if (distX < escapeDistance) {
                return true;
            }
        }
        return false;
    }


    function getMouseX(event) {
        var rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
    }

    function getPlayerX(destination, delay, currentX) {
        //if not colliding with blocker
        if (currentX <= destination - delay) {
            currentX = currentX + delay;
        } else if (currentX >= destination + delay) {
            currentX = currentX - delay;
        }
        var boundaryR = canvas.width - player.r;
        var boundaryL = player.r;
        if (currentX >= boundaryR) {
            currentX = boundaryR;
        } else if (currentX <= boundaryL) {
            currentX = boundaryL;
        }
        return currentX;
    }
};

window.onload = startGame;