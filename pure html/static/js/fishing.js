function contain(value,min,max){
    return value > min && value < max;
}

var ww = window.innerWidth;
var wh = window.innerHeight;

var VW = x=>(x/100)*ww;
var VH = x=>(x/100)*wh;

//the canves to draw 
var float_cv = null;
var floatCtx = null;
var fcw = null;
var fch = null;

var process_cv = null;
var processCtx = null;
var pcw = null;
var pch = null;

//images
var img_float = null;

//object
var float_object = null;
var fish_object = null;
var process_object = null;

const collision_loss = 0.4;
var acceleration_of_gravity = 1000;


var frameTime = 10;
var frameTimeUpdate = frameTime / 1000;
function frame(e){
    fish_object.clearDraw()
    float_object.clearDraw();
    process_object.clearDraw();
    
    fish_object.update(frameTimeUpdate);
    float_object.update(frameTimeUpdate);
    process_object.update(frameTimeUpdate);
    
    float_object.draw();
    fish_object.draw();
    process_object.draw();
    if(process_object.curLen != 100)
        setTimeout(frame,frameTime);
    else
        swal({
                title:"Bingo!",
                icon:"success",
                closeOnClickOutside: false,
                buttons:["再玩一把","重新开始"]
            }).then(res=>{
                location.reload();
            });
}

function userPressDownHandle(e){
    float_object.startUp();
}

function userPressUpHandle(e){
    float_object.endUp();
}

$(function(){
    $("body").on({
        mousedown:userPressDownHandle,
        touchstart:userPressDownHandle,
        mouseup:userPressUpHandle,
        touchend:userPressUpHandle,
    })
    
    float_cv = document.getElementById("float_cv");
    floatCtx = float_cv.getContext("2d");
    float_cv.width = VH(23.9);
    float_cv.height= VH(80);
    fcw = float_cv.width;
    fch = float_cv.height;
    
    frame_bottom_y = fch*0.78;
    frame_top_y = fch*0.05;

    fish_object = {
        ctx:floatCtx,
        lttpx : 0.9*fcw/2,
        lttpy : fch*0.8,
        aimpy : fch*0.8,

        width : fcw*0.2,
        height: fcw*0.2,
        time_counter:0,
        update:function(dt){
            this.time_counter += dt*100;
            this.lttpy += dt*(this.aimpy - this.lttpy) + Math.random();
            if(parseInt(this.time_counter)%60 == 0){
                var r = Math.random();
                while(r<0.05 && r > 0.8);
                // console.log(r);
                this.aimpy = fch * r;
            }
        },
        img : document.getElementById("fish"),
        draw:function(){
            this.ctx.drawImage(
                this.img,
                this.lttpx,
                this.lttpy,
                this.width,
                this.height
            );
        },
        clearDraw:function(){
            this.ctx.clearRect(
                this.lttpx,
                this.lttpy,
                this.width,
                this.height
            );
        }                
    }

    float_object = {
        ctx:floatCtx,
        lttpx : 0.9*fcw/2,
        lttpy : fch*0.05,
        width : fcw*0.2,
        height: fch/6,
        velocity: 0,
        velocityMax : 10,
        upFlag:false,
        startUp:function(){
            acceleration_of_gravity = -acceleration_of_gravity;
        },
        up:function(){
            if(this.upFlag){
                this.velocity -= this.velocity < this.velocityMax ? 1 : 0;
                setTimeout(this.up,10);
            }
        },
        endUp:function(){
            acceleration_of_gravity = -acceleration_of_gravity;
        },
        update:function(dt){
            if(this.lttpy < frame_top_y){
                this.lttpy = frame_top_y;
                //反弹，有速度损耗
                this.velocity *= -collision_loss;
                return;
            } 
            if(this.lttpy > frame_bottom_y){
                this.lttpy = frame_bottom_y;
                this.velocity *= -collision_loss;
                return;
            }
            this.velocity += acceleration_of_gravity * dt;
            this.lttpy += this.velocity * dt;
        },
        img:document.getElementById("float"),
        draw:function(){
            this.ctx.drawImage(
                this.img,
                this.lttpx,
                this.lttpy,
                this.width,
                this.height
            );
        },
        clearDraw:function(){
            this.ctx.clearRect(
                this.lttpx,
                this.lttpy,
                this.width,
                this.height
            );
        }
    }

    process_cv = document.getElementById("process_cv");
    processCtx = process_cv.getContext("2d");
    process_cv.width = VH(2);
    process_cv.height= VH(73);

    process_object = {
        curLen:0,
        ctx:processCtx,
        height:process_cv.height,
        width:process_cv.width,
        update:function(dt){
            if(this.curLen >= 0 && this.curLen <= 100){
                var flag = false;

                var fishTopY = fish_object.lttpy;
                var fishBtmY = fish_object.lttpy + fish_object.height;

                var floatTopY = float_object.lttpy;
                var floatBtmY = float_object.lttpy + float_object.height;

                if(contain(fishTopY,floatTopY,floatBtmY) 
                || contain(floatBtmY,floatTopY,floatBtmY)){
                    this.curLen += dt*50;
                    if(this.curLen>100)
                        this.curLen = 100;
                }
                else{
                    this.curLen -= dt*50;
                    if(this.curLen < 0)
                        this.curLen = 0;
                }
                
            }
        },
        draw:function(){
            var barlen = this.height * this.curLen / 100;
            var lg = this.ctx.createLinearGradient(0,0,0,barlen);
            lg.addColorStop(0, 'rgb(0,255,0)');
            lg.addColorStop(1, 'rgb(210,105,30)');
            this.ctx.fillStyle = lg;
            this.ctx.fillRect(0,this.height - barlen,this.width,this.height);
        },
        clearDraw:function(){
            var barlen = this.height * this.curLen / 100;
            this.ctx.clearRect(0,0,this.height - barlen,this.height);
        }
    }
    setTimeout(frame,frameTime);
});