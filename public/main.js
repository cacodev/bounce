'use strict';

(function () {
    var canvas = document.querySelector('canvas');
    var socket = io();

    canvas.addEventListener('click', clickAddBall, false);

    socket.on('addBall', addSocketBall);

    function addSocketBall(ballData) {
        let ball = new Ball(ballData);
        //ball.addEventListener('deadball', removeBall);
        balls.push(ball);
    }

    function clickAddBall() {
        let ball = new Ball();
        socket.emit('addBall', ball.toDto());
        //ball.addEventListener('deadball', removeBall);
        balls.push(ball)
    }

    window.addEventListener('resize', onResize, false);
    onResize();

    // make the canvas fill its parent
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    var ctx = canvas.getContext('2d');

    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;

    // function to generate random number

    function random(min, max) {
        var num = Math.floor(Math.random() * (max - min)) + min;
        // if min = 10 max = 15 random var = 0.1544465; it will return approzimately 10 because of math.floor
        return num;
    }

    function Ball(ballData) {
        if (ballData) {
            const b = ballData;
            this.x = b.x;
            this.y = b.y;
            this.velX = b.velX;
            this.velY = b.velY;
            this.color = b.color;
            this.size = b.size;
            this.bounces = b.bounces;
        } else {
            this.x = random(0, width);
            this.y = random(0, height);
            this.velX = random(-7, 7);
            this.velY = random(-7, 7);
            this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            this.size = random(10, 20);
            this.bounces = 0;
        }
        
        this.deadball = function() { }
    }

    Ball.prototype.toDto = function() {
        return {
            x: this.x,
            y: this.y,
            velX: this.velX,
            velY: this.velY,
            color: this.color,
            size: this.size,
            bounces: this.bounces
        }
    }

    Ball.prototype.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    Ball.prototype.update = function () {
        // max 2 bounces
        if (this.bounces < 2) {
            if ((this.x + this.size) >= width) {
                this.bounces++;
                this.velX = -(this.velX);
            }
    
            if ((this.x - this.size) <= 0) {
                this.bounces++;
                this.velX = -(this.velX);
            }
    
            if ((this.y + this.size) >= height) {
                this.bounces++;
                this.velY = -(this.velY);
            }
    
            if ((this.y - this.size) <= 0) {
                this.bounces++;
                this.velY = -(this.velY);
            }

            this.x += this.velX;
            this.y += this.velY;
        } else {
            if ((this.x - this.size >= width) || 
                (this.x + this.size <= 0) ||
                (this.y - this.size >= height) || 
                (this.y + this.size <= 0)) {
                this.color = 'rgba(0,0,0,0)';
                //this.emit('deadball', this);
            } else {
                this.x += this.velX;
                this.y += this.velY;
            }
        }
    }
    var balls = [];
    Ball.prototype.collisionDetect = function () {
        for (j = 0; j < balls.length; j++) {
            if ((!(this.x === balls[j].x && this.y === balls[j].y && this.velX === balls[j].velX && this.velY === balls[j].velY))) {
                var dx = this.x - balls[j].x;
                var dy = this.y - balls[j].y;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + balls[j].size) {
                    balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                }
            }
        }
    }
    balls = [];

    function init() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, width, height);

        for (var i = 0; i < balls.length; i++) {
            balls[i].draw();
            balls[i].update();
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