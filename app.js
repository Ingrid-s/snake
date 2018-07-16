// Variables globales
let speed = 70;
let size = 15;

class object {
     constructor(){
          this.size = size;
     }

     shock(obj) {
          let difx = Math.abs(this.x - obj.x);
          let dify = Math.abs(this.y - obj.y);
          if(difx >= 0 && difx < size && dify >= 0 && dify < size){
               return true;
          } else {
               return false;
          }
     }
}

class Tale extends object {
     constructor(x,y) {
         super();
          this.x = x;
          this.y = y;
          this.next = null;
     }
     draw (ctx) {
         if(this.next !=null) {
             this.next.draw(ctx);
         }
          ctx.fillStyle = "#6ad2f3";
          ctx.fillRect(this.x, this.y, this.size, this.size);
     }
     setxy(x,y){
		if(this.next != null){
			this.next.setxy(this.x, this.y);
		}
        this.x = x;
        this.y = y;
     }
     insert () {
         if(this.next == null){
             this.next = new Tale(this.x, this.y);
         }else {
           this.next.insert();
         }
     }
     seeNext() {
         return this.next;
     }
}
class Food extends object {
    constructor() {
        super();
        this.x = this.generate ();
        this.y = this.generate ();
    }
    generate () {
        let num = (Math.floor(Math.random() *59))*10;
        return num;
    }
    put() {
        this.x = this.generate();
        this.y = this.generate();
    }
    draw(ctx) {
        ctx.fillStyle ="#e53935";
        ctx.fillRect (this.x, this.y, this.size, this.size);
    }
}
//Objetos del juego
let head = new Tale(20,20);
let food = new Food();
let xaxis = true;
let yaxis = true;
let xdir = 0;
let ydir = 0;

function movement (){
    let nx = head.x+xdir;
    let ny = head.y+ydir;
    head.setxy(nx,ny);
}

function control (event) {
    let code = event.keyCode;
    if (xaxis) {
        if(code == 38){
            ydir = -size;
            xdir = 0;
            xaxis = false;
            yaxis = true;
        }
        if(code == 40) {
            ydir = size;
            xdir = 0;
            xaxis = false;
            yaxis = true;
        }
    }
    if (yaxis) {
        if(code == 37) {
            ydir = 0;
            xdir = -size;
            xaxis = true;
            yaxis = false;
    }
    if(code == 39) {
        ydir = 0;
        xdir = size;
        xaxis = true;
        yaxis = false;
        }
    }

}

function endGame() {
    xdir = 0;
    ydir = 0;
    xaxis = true;
    yaxis = true;
    head = new Tale(20,20);
    food = new Food ();
    alert("You lose, try again!");
}
function crashwall() {
    if (head.x < 0 || head.x > 590 || head.y < 0 || head.y > 590) {
        endGame();
    }
}
function bodycrash(){
    let temp = null;
    try{
        temp = head.seeNext().seeNext();
    }catch (fail) {
        temp = null;
    }
    while(temp != null) {
        if(head.shock(temp)) {
            endGame();
        } else {
            temp = temp.seeNext();
        }
    }
}

function draw () {
    let canvas = document.getElementById("board");
    // para renderizar en dos dimenciones, también hay otros contextos como webgl para 3D pero no esta soportado en todos los navegadores.
    let ctx = canvas.getContext ("2d");
    // limpiamos toda el area del lienzo constantemente para dar el efecto de animacion.
    ctx.clearRect(0,0, canvas.width, canvas.height);
    //acá va el dibujo
    head.draw(ctx);
    food.draw(ctx);
}

function main () {
    bodycrash();
    crashwall();
     draw();
     movement();
     if(head.shock(food)) {
         food.put();
         head.insert();
     }
}
//en el intervalo se le pasan como parametros una funcion y la variable de velocidad, esta será en milisegundos
setInterval("main()", speed);