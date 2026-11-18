const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
let width=0;
let height=0;
let mouse={x:0,y:0};
let head={x:0,y:0};
let snake=[];
let particles=[];
let stars=[];
let time=0;
let paused=false;
const SETTINGS={
    snakeLength:100,
    snakeSpeed:0.18,
    particleCount:180,
    connectionDistance:120,
    starCount:100
};
function resize(){
    width=canvas.width=window.innerWidth;
    height=canvas.height=window.innerHeight;
    mouse.x=width/2;
    mouse.y=height/2;
    head.x=width/2;
    head.y=height/2;
}
window.addEventListener("resize",resize);
resize();
function createSnake(){
    snake=[];
    for(let i=0;i<SETTINGS.snakeLength;i++){
        snake.push({x:head.x-i*4,y:head.y});
    }
}
function createParticles(){
    particles=[];
    for(let i=0;i<SETTINGS.particleCount;i++){
        particles.push({
            x:Math.random()*width,
            y:Math.random()*height,
            vx:(Math.random()-0.5)*0.5,
            vy:(Math.random()-0.5)*0.5,
            size:Math.random()*2+1
        });
    }
}
function createStars(){
    stars=[];
    for(let i=0;i<SETTINGS.starCount;i++){
        stars.push({
            x:Math.random()*width,
            y:Math.random()*height,
            size:Math.random()*1.5,
            alpha:Math.random()
        });
    }
}
createSnake();
createParticles();
createStars();
window.addEventListener("mousemove",e=>{
    mouse.x=e.clientX;
    mouse.y=e.clientY;
});
window.addEventListener("touchmove",e=>{
    mouse.x=e.touches[0].clientX;
    mouse.y=e.touches[0].clientY;
},{passive:true});
window.addEventListener("keydown",e=>{
    if(e.code==="Space"){
        paused=!paused;
    }
});
function drawBackground(){
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.fillRect(0,0,width,height);
}
function drawStars(){
    for(let star of stars){
        star.alpha+=Math.random()*0.04-0.02;
        star.alpha=Math.max(0.1,Math.min(1,star.alpha));
        ctx.beginPath();
        ctx.arc(star.x,star.y,star.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${star.alpha})`;
        ctx.fill();
    }
}
function moveSnake(){
    let dx=mouse.x-head.x;
    let dy=mouse.y-head.y;
    head.x+=dx*SETTINGS.snakeSpeed;
    head.y+=dy*SETTINGS.snakeSpeed;
    snake[0].x=head.x;
    snake[0].y=head.y;
    for(let i=1;i<snake.length;i++){
        let previous=snake[i-1];
        let current=snake[i];
        let dx=previous.x-current.x;
        let dy=previous.y-current.y;
        let distance=Math.sqrt(dx*dx+dy*dy);
        if(distance>4){
            current.x+=dx/distance*4;
            current.y+=dy/distance*4;
        }
    }
}
function drawSnake(){
    for(let i=snake.length-1;i>=0;i--){
        let point=snake[i];
        let size=14*(1-i/snake.length)+2;
        let alpha=1-i/snake.length;
        ctx.beginPath();
        ctx.arc(point.x,point.y,size,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${alpha})`;
        ctx.shadowBlur=20;
        ctx.shadowColor="white";
        ctx.fill();
    }
    ctx.shadowBlur=0;
    ctx.beginPath();
    ctx.arc(head.x,head.y,17,0,Math.PI*2);
    ctx.fillStyle="white";
    ctx.shadowBlur=30;
    ctx.shadowColor="white";
    ctx.fill();
    ctx.shadowBlur=0;
}
function moveParticles(){
    for(let p of particles){
        p.x+=p.vx;
        p.y+=p.vy;
        if(p.x<0||p.x>width)p.vx*=-1;
        if(p.y<0||p.y>height)p.vy*=-1;
    }
}
function drawParticles(){
    for(let i=0;i<particles.length;i++){
        let p=particles[i];
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle="rgba(255,255,255,0.7)";
        ctx.fill();
        for(let j=i+1;j<particles.length;j++){
            let other=particles[j];
            let dx=p.x-other.x;
            let dy=p.y-other.y;
            let distance=Math.sqrt(dx*dx+dy*dy);
            if(distance<SETTINGS.connectionDistance){
                ctx.beginPath();
                ctx.moveTo(p.x,p.y);
                ctx.lineTo(other.x,other.y);
                ctx.strokeStyle=`rgba(255,255,255,${1-distance/SETTINGS.connectionDistance})`;
                ctx.lineWidth=0.5;
                ctx.stroke();
            }
        }
    }
}
function drawSnakeConnections(){
    for(let i=0;i<snake.length-1;i++){
        let a=snake[i];
        let b=snake[i+1];
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.strokeStyle="white";
        ctx.lineWidth=12*(1-i/snake.length)+2;
        ctx.lineCap="round";
        ctx.shadowBlur=15;
        ctx.shadowColor="white";
        ctx.stroke();
    }
    ctx.shadowBlur=0;
}
function animate(){
    requestAnimationFrame(animate);
    if(paused)return;
    time+=0.01;
    drawBackground();
    drawStars();
    moveSnake();
    drawSnakeConnections();
    drawSnake();
    moveParticles();
    drawParticles();
}
animate();