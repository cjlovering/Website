(function(){

            var canvas, ctx;
            var resizeId;
            var star_num = 500;
            var stars = [];       //create stars
            var rate = 100;
            var target; //move towards target
            var seek = true;     //move away from

            $(document).ready(function(){
                
                canvas = document.getElementById('starzone');
               
                if (canvas.getContext){
                    
                    ctx = canvas.getContext('2d');

                    configureCanvas();

                    target = {x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)};

                    createStars();

                    drawStars();

                    canvas.addEventListener("mousemove", function(eventInfo) {
                        seek = true;
                        target = {x: eventInfo.offsetX || eventInfo.layerX, y:eventInfo.offsetY || eventInfo.layerY};
                    });

                    canvas.addEventListener("mouseup", function(eventInfo){
                        //may want to do more here ... EXPLODE
                        seek = false;
                        target = {x: eventInfo.offsetX || eventInfo.layerX, y:eventInfo.offsetY || eventInfo.layerY};
                    });

                    canvas.addEventListener("mouseout", function(eventInfo){
                        //may want to do more here ... EXPLODE
                        seek = false;
                        i = 2;
                    });

                    $(window).resize(function(){
                        clearTimeout(resizeId);
                        resizeId = setTimeout(onResizeDraw, 300);
                    });

                    loop();
                }
            });


            function Star() {

                this.x = Math.floor((Math.random() * canvas.width) + 1);
                this.y = Math.floor((Math.random() * canvas.height) + 1);
                this.lag = Math.random() < 0.8 ? Math.floor((Math.random() * 13) + 2) : ( Math.random() * 48 + 2 );//Math.floor((Math.random() * 48) + 2);
                this.r = 5;
                this.color = "#" + ("000000" + (0xFFFFFF*Math.random()).toString(16)).substr(-6); //original random color
                this.t = {x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)};

                //this.color = {r: Math.floor(255 * Math.random()), g: Math.floor(255 * Math.random()), b: Math.floor(255 * Math.random())};
                this.i = 1;

                this.React = function(){
        
                    var ratio = (Math.sqrt( square(target.x - this.x) + square(target.y - this.y) ) / (canvas.width));
                    this.r =  Math.floor ( 25 * ratio ) + 1;

                    if (seek){

                        if (this.i == 0){
                            
                            this.x += (Math.round(Math.random()) * 2 - 1) * (Math.floor((Math.random() * 5) + 1)) * .5 /  ( this.r );
                            this.y += (Math.round(Math.random()) * 2 - 1) * (Math.floor((Math.random() * 5) + 1)) * .5 /  ( this.r );

                            if (Math.abs(target.x - this.x) > 35 || Math.abs(target.y - this.y) > 35 ){
                                this.i = 1;
                            }

                        } else {

                            this.x += (target.x - this.x) * .5 / (this.r + this.lag);
                            this.y += (target.y - this.y) * .5 / (this.r + this.lag);


                            if (Math.abs(target.x - this.x) < 3 && Math.abs(target.y - this.y) < 3){
                                this.i = 0;
                            }

                        }

                    } else {

                        var xx = (target.x - this.x);
                        var yy = (target.y - this.y);

                        if (this.i == 2 || xx > canvas.width / 4 || yy > canvas.height / 4){
                            
                           this.i = 2;

                            var ratio = (Math.sqrt( square(this.t.x - this.x) + square(this.t.y - this.y) ) / (canvas.width));
                            this.r =  Math.floor ( 25 * ratio ) + 1;

                            this.x += (this.t.x - this.x) * .5 / (this.r + this.lag);
                            this.y += (this.t.y - this.y) * .5 / (this.r + this.lag);


                        } else {
                            console.log(this.i);

                            this.x += 4 * xx; 
                            this.y += 4 * yy;

                        }

                    }
                    
                    ctx.fillStyle = this.color; //getShade(this.color, ratio); 
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();

                    //closer to hide -> faster move away

                    //closer to target -> faster move in

                    //closer to target -> smaller

                    //further from target -> more colorful
                }
            }

            function getShade(original, ratio){
                if (ratio < .2)  return "rgb( " + Math.min(255, original.r + 255 * 1.5 * ratio) + ", " + Math.min(255, original.g + 255 * 1.5 * ratio) + ", " + Math.min(255, original.b + 255 * 1.5 * ratio) + ")";// return "rgb(" + Math.min(255, c.r + 255 * ratio) + ", " + Math.min(255, c.g + 255 * ratio) + ", " + Math.min(255, c.b + 255 * ratio) + ")";
                else return "rgb(" + Math.max(original.r , original.r + 255 * 1.5 * .1 - 255 * ratio) + ", " + Math.max(original.g, original.r + 255 * 1.5 * .1 - 255 * ratio) + ", " + Math.max(original.b, original.r + 255 * 1.5 * .1 - 255 * ratio) + ")";
            }

            function createStars(){
                for ( var i = 0; i < star_num; i++) stars.push( new Star() );
            }


            function loop(){
                setTimeout(function(){
                
                    drawStars();
                    loop();

                }, 1000/rate);
            }


            function onResizeDraw(){
                configureCanvas();
                drawStars();
            }
 
            function getColor(n){
                var colors    = [ "#ccff66", "#FFD700","#66ccff", "#ff6fcf", "#ff6666"];
                n %= colors.length;
                return colors[n];
            }

            function drawStars() {
                ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (s in stars) {
                    stars[s].React();
                }
            }

            function configureCanvas(){
                var h = $(window).height();
                var w = $(window).width();

                canvas.width = w;
                canvas.height = h; 
            }

            function square(i){
                return i * i;
            }
        })(); 


        /*
        ublic static Color Lighten(Color inColor, double inAmount)
{
  return Color.FromArgb(
    inColor.A,
    (int) Math.Min(255, inColor.R + 255 * inAmount),
    (int) Math.Min(255, inColor.G + 255 * inAmount),
    (int) Math.Min(255, inColor.B + 255 * inAmount) );
}
*/