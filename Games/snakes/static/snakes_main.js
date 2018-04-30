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

    var player = { x: canvas.width * .5, y: canvas.height * 0.8, r: gameUnit / 2, num:10 }
    var playerSpeed = 10;
    var blocker1 = { x: canvasWidth * 0.0, y: 0, w: gameUnit * 2, h: gameUnit, num: 10 };
    var blocker2 = { x: canvasWidth * 0.25, y: 0, w: gameUnit * 2, h: gameUnit, num: 10 };
    var blocker3 = { x: canvasWidth * 0.50, y: 0, w: gameUnit * 2, h: gameUnit, num: 10 };
    var blocker4 = { x: canvasWidth * 0.75, y: 0, w: gameUnit * 2, h: gameUnit, num: 10 };
    var blockers = new Array();
    blockers.push(blocker1);
    blockers.push(blocker2);
    blockers.push(blocker3);
    blockers.push(blocker4);
    var strokeWidth = 1;
    var strokeColor = 'black';
    var scrollingSwitch = true;

    window.setInterval(function () {
        ctx.clearRect(0, canvasOriginY, canvas.width, canvas.height);
        if (scrollingSwitch == true) {
            for (i = 0; i<blockers.length; i++){
                blockers[i].y += globalGameSpeed;
                if (blockers[i].y > canvasHeight) { // reset blocker
                    blockers[i].num = 10;
                    blockers[i].y = canvasOriginY - 50;
                    blockers[i].x = canvasWidth * (i * 0.25);
                }
            }
        }

        player.x = getPlayerX(mouseX, playerSpeed, player.x);
        collisionHandler();
        drawPlayer();
        drawObstacles(event);

    }, gameRefreshRate);


    function drawPlayer() {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
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
            ctx.fillText(element.num, element.x + element.w / 3, element.y + element.h * .8);
        })
    }

    // return true if the rectangle and circle are colliding
    var timeSinceLastCollision = 0;
    function collisionHandler() {
        for (i = 0; i < blockers.length; i++) {
            if (isColliding(player, blockers[i])) {
                scrollingSwitch = false;
                timeSinceLastCollision += 1;
                if (timeSinceLastCollision > 10){
                    blockers[i].num -= 1;
                    timeSinceLastCollision = 0;
                }
                return;
            }
            scrollingSwitch = true;
        }
    }

    function isColliding(circle, blocker) {
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