'use strict';

(function () {
    var canvas = document.querySelector('canvas');
    var socket = io();

    canvas.addEventListener('click', clickAddBall, false);

    socket.on('addBall', addSocketBall);

    function addSocketBall(ballData) {
        let ball = new Ball(0, 0, ballData);
        drawClick(ball);
        ball.on('deadball', removeBall);
        balls.push(ball);
    }

    function clickAddBall(event) {
        let ball = new Ball(event.clientX, event.clientY);
        drawClick(ball);
        socket.emit('addBall', ball.toDto());
        ball.on('deadball', removeBall);
        balls.push(ball);
    }

    function drawClick(ball) {
        ctx.beginPath();
        ctx.fillStyle = ball.color;
        ctx.arc(ball.x, ball.y, 40, 0, 2 * Math.PI);
        ctx.fill();
    }

    var width = canvas.width;
    var height = canvas.height;

    window.addEventListener('resize', onResize, false);
    onResize();

    // make the canvas fill its parent
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        width = canvas.width;
        height = canvas.height;
    }

    var ctx = canvas.getContext('2d');

    let balls = [];

    function init() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, width, height);

        for (var i = 0; i < balls.length; i++) {
            balls[i].draw(ctx);
            balls[i].update(width, height);
        }

        requestAnimationFrame(init);
    }

    function removeBall(deadBall) {
        balls = balls.filter(b => {
            return b !== deadBall;
        });
    }

    init();
})();