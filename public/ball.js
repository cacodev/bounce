class Ball {
    constructor(x, y, ballData) {
        if (ballData) {
            const b = ballData;
            this.x = b.x;
            this.y = b.y;
            this.velX = b.velX;
            this.velY = b.velY;
            this.color = b.color;
            this.size = b.size;
            this.bounces = b.bounces;
        } else if (x && y) {
            this.x = x;
            this.y = y;
            this.velX = this.random(-7, 7);
            this.velY = this.random(-7, 7);
            this.color = 'rgb(' + this.random(0, 255) + ',' + this.random(0, 255) + ',' + this.random(0, 255) + ')';
            this.size = this.random(10, 20);
            this.bounces = 0;
        }
        this._listeners = {};
    }
    random(min, max) {
        var num = Math.floor(Math.random() * (max - min)) + min;
        // if min = 10 max = 15 random var = 0.1544465; it will return approzimately 10 because of math.floor
        return num;
    }
    on(type, listener) {
        if (typeof this._listeners[type] == 'undefined') {
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    }
    toDto() {
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
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    collisionDetect() {
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
    update(width, height) {
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
                if (this._listeners['deadball'] instanceof Array) {
                    var listeners = this._listeners['deadball'];
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        listeners[i](this);
                    }
                }
            } else {
                this.x += this.velX;
                this.y += this.velY;
            }
        }
    }
}
