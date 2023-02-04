const mapSize = [1000,650];

const alienBase = ".\\images\\alienBase.png";
const topAlienBase = [478,-40];
const rightAlienBase = [995,300];
const bottomAlienBase = [480,640];
const leftAlienBase = [-40,300];

const movementRefreshRate = 100; // movement refreshrate in milliseconds

var alienScareDistance = 100;   //How far away player is (in pixels) to scare aliens 
var playerImpactDistance = 50;   //How far away objects are (in pixels) to cause collisions with aliens

var spawnRate = 5000;
var spawnAliens;

var kills = 0;
var highScore = ["None",0];
var clock = 3 ;
var timer ;
var id = 0;


//Player controls
var a = 97;
var d = 100;
var w = 119;
var s = 115; 

var player = {
    name : "Lee",
    health : 100,
    left : 100,
    top : 100,
    right : 0,
    bottom : 0,
    middle : [0,0],
    speed : 8,
    direction : "left",
    rightFacingImage : ".\\images\\fireTruckFacingRight.png",
    leftFacingImage : ".\\images\\fireTruckFacingLeft.png",
    upFacingImage : ".\\images\\fireTruckFacingUp.png",
    downFacingImage : ".\\images\\fireTruckFacingDown.png"
};

var house = {
    health : 100 ,
    size : 75,
    left : 465,
    top : 285,
    right : 540,
    bottom : 360,
    image : ".\\images\\house1.png"
};

//class to spawn aliens
class Alien {
    constructor(alienID){   //alien var properties
        this.id = "alien" + alienID;
        this.left=50;
        this.top = 50;
        this.speed = 1;
        this.alive = false;
        this.readyToAttack = true;
        this.attackDamage = 10;
        }

        spawn(){     // method to append new img element to DOM
            var p = document.getElementById("background");
            var el = document.createElement("img");

            el.src=".\\images\\alien.png";
            el.setAttribute('id',this.id);
            el.setAttribute('class',"alien");
            p.appendChild(el);
            this.alive = true;
                
            // this is for start position of new element
            var randomNumber = Math.ceil(Math.random() * 4); 

            switch(randomNumber){
                case 1: 
                    this.left=topAlienBase[0];
                    this.top=topAlienBase[1];
                    document.getElementById(this.id).style.top = this.top + "px";
                    document.getElementById(this.id).style.left = this.left + "px";
                    break;
                case 2: 
                    this.left=rightAlienBase[0];
                    this.top=rightAlienBase[1];
                    document.getElementById(this.id).style.top = this.top + "px";
                    document.getElementById(this.id).style.left = this.left + "px";
                    break;
                case 3: 
                    this.left=bottomAlienBase[0];
                    this.top=bottomAlienBase[1];
                    document.getElementById(this.id).style.top = this.top + "px";
                    document.getElementById(this.id).style.left = this.left + "px";
                    break;
                case 4: 
                    this.left=leftAlienBase[0];
                    this.top=leftAlienBase[1];
                    document.getElementById(this.id).style.top = this.top + "px";
                    document.getElementById(this.id).style.left = this.left + "px";
                }
            // play sound 
            var spawnSound = new Audio('.\\sound\\spawnSound.mp3');
            spawnSound.play();

            // Start movement
            this.startMovement();

        }

        startMovement(){                //make alien img move
            
            var alienFlee = this.flee();  //chase house or run from player. Ruturns true for run
            
            if(alienFlee){
                // change image 
                document.getElementById(this.id).src=".\\images\\alienScared.png";

                // player and boundry position
                var playerLeft = this.left > player.left && this.left > 10;
                var playerRight = this.left < player.left && this.left < mapSize[0];
                var playerAbove = this.top > player.top && this.top < mapSize[1];
                var playerBelow = this.top < player.top && this.top > 10; 
                
                // run behaviour
                if(playerLeft){
                    this.left = this.left + this.speed;
                } else if(playerRight){
                    this.left = this.left - this.speed;
                }
                if(playerAbove){
                    this.top = this.top + this.speed;
                } else if(playerBelow){
                    this.top = this.top - this.speed;
                }
                
            } else {
                //image changes
                document.getElementById(this.id).src=".\\images\\alien.png";

                //house position
                var houseLeft = this.left > house.left;
                var houseRight = this.left < house.left;
                var houseAbove = this.top > house.top;
                var houseBelow = this.top < house.top;
                
                //move to house
                if(houseLeft){
                    this.left = this.left - this.speed;
                }  else if(houseRight){
                    this.left = this.left + this.speed;
                }
                if(houseAbove){
                    this.top = this.top - this.speed;
                }  else if(houseBelow){
                    this.top = this.top + this.speed;
                }                
            }
            
            document.getElementById(this.id).style.left = this.left + "px";
            document.getElementById(this.id).style.top = this.top + "px";

            this.collisionCheck();

            if(this.alive===true){
            setTimeout(() => { this.startMovement() }, 40);  //repeat movement, call itself
            }
        }

        flee(){
              
            var alienMiddle = [this.left+20,this.top+20];   //find middle of alien 
            
            if(player.direction==="left" || player.direction==="right"){    //find middle of player
                var playerMiddle = [player.left + 50, player.top + 25];
            }else{
                var playerMiddle = [player.left + 25, player.top + 50];
            }

            var hDiff = alienMiddle[0] - playerMiddle[0];     // difference in position
            var vDiff = alienMiddle[1] - playerMiddle[1];       // difference in position
            
            if(hDiff < 0){hDiff *= -1; }    //make difference a positive number
            if(vDiff < 0){vDiff *= -1; }    //make difference a positive number
          
            var run = hDiff < alienScareDistance && vDiff < alienScareDistance;
            return run;

        }
        collisionCheck(){

            var alienMiddle = [this.left+20,this.top+20];   //find middle of the alien 
            
            if(player.direction==="left" || player.direction==="right"){    //find middle of player
                var playerMiddle = [player.left + 50, player.top + 25];
            }else{
                var playerMiddle = [player.left + 25, player.top + 50];
            }

            var houseMiddle = [house.left + 25, house.top + 25]; // find the middle of the house

            var playerHDiff = alienMiddle[0] - playerMiddle[0];     // difference in position   (player)
            var playerVDiff = alienMiddle[1] - playerMiddle[1];       // difference in position (player)
            var houseHDiff = alienMiddle[0] - houseMiddle[0];     // difference in position   (house)
            var houseVDiff = alienMiddle[1] - houseMiddle[1];       // difference in position (house)

            if(playerHDiff < 0){playerHDiff *= -1; }    //make difference a positive number
            if(playerVDiff < 0){playerVDiff *= -1; }    
            if(houseHDiff < 0){houseHDiff *= -1; }    
            if(houseVDiff < 0){houseVDiff *= -1; }    
          
            if (playerHDiff < playerImpactDistance && playerVDiff < playerImpactDistance){
                this.kill();
            } else if(houseHDiff < house.size/2 && houseVDiff < house.size/2){
                this.attackHouse();
            }
        }
        attackHouse(){

            this.kill();
            house.health -= this.attackDamage;
            document.getElementById("houseHealth").innerHTML=house.health;
            if (house.health===0){
                gameOver();
            }
                                                // change picture based on damage
            if (house.health<20){
                document.getElementById("house").src=".\\images\\house4.png";
            } else if (house.health<40){
                document.getElementById("house").src=".\\images\\house3.png";
            } else if (house.health<60){
                document.getElementById("house").src=".\\images\\house2.png";
            } else if(house.health<80){
                document.getElementById("house").src=".\\images\\house2.png";
            } else {
                document.getElementById("house").src=".\\images\\house1.png";
            }     
        }

        kill(){
            
            // play sound 
            var squishedSound = new Audio('.\\sound\\squashed2.mp3');
            squishedSound.play();

            // increment kills
            kills++;
            document.getElementById("killCounterNumber").innerHTML=kills;

            //remove alien img and add splat img
            this.alive = false;
            addImageElement("background",kills,".\\images\\splat.png");
            document.getElementById(kills).style.left = this.left + "px";
            document.getElementById(kills).style.top=this.top + "px";
            document.getElementById(kills).style.position="absolute";
            document.getElementById(kills).style.width="40px"; 
            removeElement(this.id);  

            //spawn rate increases
            spawnRate -= 400;
                        
        }

}

function addTextElement(parentId, elementTag, elementId, html) {
    // Adds a text element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

function addImageElement(parentId, elementId, source) {
    // Adds an image element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement("img");
    newElement.setAttribute('id', elementId);
    newElement.src = source;
    p.appendChild(newElement);
}

function addButtonElement(parentId, elementId, clickFunction) {
    // Adds an image element to the document
    let b = document.getElementById(parentId);
    let newButton = document.createElement("button");
    newButton.setAttribute('id', elementId);
    newButton.addEventListener("click", clickFunction);
    p.appendChild(newButton);
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function playerMovement(event){
    var key = event.which;      // store key press 

    if (player.direction==="left" || player.direction==="right"){   // find out where player boundries are
        player.right = player.left + 100;
        player.bottom = player.top + 50;
        player.middle = [player.left + 50, player.top + 25 ];

    } else{
        player.right = player.left + 50;
        player.bottom = player.top + 100;
        player.middle = [player.left + 25, player.top + 50 ];
    }

    console.log(player.middle); //testing

    // player, house collision parameters
    var collisionRight = player.right > house.left && player.right < house.right && player.middle[1] > house.top -25 && player.middle[1] < house.bottom +25;  
    var collisionLeft = player.left > house.left && player.left < house.right && player.middle[1] > house.top -25 && player.middle[1] < house.bottom +25;
    var collisionTop = player.top > house.top && player.top < house.bottom && player.middle[0] > house.left -25 && player.middle[0] < house.right +25;
    var collisionBottom = player.bottom > house.top && player.bottom < house.bottom && player.middle[0] > house.left -25 && player.middle[0] < house.right +25;
    
    //var playerCollision = collisionHorizontal && collisionVerticle;

    if (key===a && player.left > 0 && collisionLeft===false){

        player.left = player.left - player.speed;
        document.getElementById("player").style.left= player.left + "px";
        document.getElementById("player").src=player.leftFacingImage;
        document.getElementById("player").style.width= "100px";
        document.getElementById("player").style.height= "50px";
        player.direction="left";
    } else if (key===d && player.left < mapSize[0]-100 && collisionRight===false){
        player.left = player.left + player.speed;
        document.getElementById("player").style.left= player.left + "px";
        document.getElementById("player").src=player.rightFacingImage;
        document.getElementById("player").style.width= "100px";
        document.getElementById("player").style.height= "50px";
        player.direction="right";
    } else if (key===w && player.top > 0 && collisionTop===false){
        player.top = player.top - player.speed;
        document.getElementById("player").style.top= player.top + "px";
        document.getElementById("player").src=player.upFacingImage;
        document.getElementById("player").style.width= "50px";
        document.getElementById("player").style.height= "100px";
        player.direction="up";
    } else if (key===s && player.top < mapSize[1]-100 && collisionBottom===false){
        player.top = player.top + player.speed;
        document.getElementById("player").style.top= player.top + "px";
        document.getElementById("player").src=player.downFacingImage;
        document.getElementById("player").style.width= "50px";
        document.getElementById("player").style.height= "100px";
        player.direction="down";
    }

}

function startGameButton(){
    //Create alien variables from class

    alien1 = new Alien(1);
    alien2 = new Alien(2);
    alien3 = new Alien(3);
    alien4 = new Alien(4);
    alien5 = new Alien(5);
    alien6 = new Alien(6);
    alien7 = new Alien(7);
    alien8 = new Alien(8);
    alien9 = new Alien(9);
    alien10 = new Alien(10);
    alien11 = new Alien(11);
    alien12 = new Alien(12);
    alien13 = new Alien(13);
    alien14 = new Alien(14);
    alien15 = new Alien(15);
    alien16 = new Alien(16);
    alien17 = new Alien(17);
    alien18 = new Alien(18);
    alien19 = new Alien(19);
    alien20 = new Alien(20);

    //JOno says check out loops baby.
    // let aliens = [];
    // for(var index = 0; index < 21;++index){
    //     aliens.push(new Alien(index));
    // }
    //Remove menu
    removeElement("gameTitle");
    removeElement("startGameButton");
    removeElement("highScore");
    removeElement("highScore1");
    removeElement("menuImage");
    removeElement("menuImage2");
    removeElement("decoration1");
    removeElement("decoration2");

    //Add player and alien bases
    setTimeout('addImageElement("background", "player", player.rightFacingImage)',1500);
    addImageElement("background", "house", house.image);
    addImageElement("background", "alienShip1", alienBase);
    addImageElement("background", "alienShip2", alienBase);
    addImageElement("background", "alienShip3", alienBase);
    addImageElement("background", "alienShip4", alienBase);
    
    countdownWithMessage(3, "");    //countdown to start game
    
    spawnAliens = setInterval("spawnAlien()", spawnRate );    //spawn aliens

    // add game stats bar
    addTextElement("background", "H1", "killCounter", "kills");            // Kill counter
    addTextElement("background", "H1", "killCounterNumber", kills);        // Kill counter

    addTextElement("background", "H1", "healthBar", "health");             //health 
    addTextElement("background", "H1", "houseHealth", house.health);     //health

}

function countdownWithMessage(numberToSTart, messagetxt){
    clock = numberToSTart;
    message = messagetxt;
    addTextElement("background", "h1" ,"countdownID", clock);
    timer = setInterval("countDown()",500); 

}

function countDown(){
    //make the clock countdown//
    clock--;
    if(clock > 0){  
        document.getElementById("countdownID").innerHTML=clock;        
        
    }
    else{
        clearInterval(timer);
        document.getElementById("countdownID").style.fontSize = "80px" ;
        removeElement("countdownID") ;
        addTextElement("background", "h2" ,"messageID", message);
        setTimeout("removeElement('messageID')",1000);
    }
}

function spawnAlien(){

        // increment id
        id++;
        if(id===21){
            id=1;
        } 

        //add an alien to the DOM from class method
        switch(id){
            case 1:
                if(alien1.alive===false){
                alien1.spawn();
                }
                break;
            case 2:
                if(alien2.alive===false){
                alien2.spawn();
                }
                break;
            case 3:
                if(alien3.alive===false){
                alien3.spawn();
                }
                break;
            case 4:
                if(alien4.alive===false){
                alien4.spawn();
                }
                break;
            case 5:
                if(alien5.alive===false){
                alien5.spawn();
                }
                break;
            case 6:
                if(alien6.alive===false){
                alien6.spawn();
                }
                break;
            case 7:
                if(alien7.alive===false){
                alien7.spawn();
                }
                break;
            case 8:
                if(alien8.alive===false){
                alien8.spawn();
                }
                break;
            case 9:
                if(alien9.alive===false){
                alien9.spawn();
                }
                break;
            case 10:
                if(alien10.alive===false){
                alien10.spawn();
                break;
                }
            case 11:
                if(alien11.alive===false){
                alien11.spawn();
                break;
                }
            case 12:
                if(alien12.alive===false){
                alien12.spawn();
                break;
                }
            case 13:
                if(alien13.alive===false){
                alien13.spawn();
                break;
                }
            case 14:
                if(alien14.alive===false){
                alien14.spawn();
                break;
                }
            case 15:
                if(alien10.alive===false){
                alien10.spawn();
                break;
                }
            case 16:
                if(alien16.alive===false){
                alien16.spawn();
                break;
                }
            case 17:
                if(alien17.alive===false){
                alien17.spawn();
                break;
                }
            case 18:
                if(alien18.alive===false){
                alien18.spawn();
                break;
                }
            case 19:
                if(alien19.alive===false){
                alien19.spawn();
                break;
                }
            case 20:
                if(alien20.alive===false){
                alien20.spawn();
                }
        }

}

function gameOver(){
    location.reload();
    
    /*
    //var highScore = new HighScore(); // add new top score
    
    removeElement("house"); //take away house
    
    //take away game stats
    removeElement("highScore");      
    removeElement("highScore1");
    removeElement("decoration1");      
    removeElement("decoration2");      

    // take away aliens
    clearInterval(spawnAliens);

    if(alien1.alive===true){
        removeElement("alien1");
    }  
    if(alien2.alive===true){
        removeElement("alien2");
    }
    if(alien3.alive===true){
        removeElement("alien3");
    }  
    if(alien4.alive===true){
        removeElement("alien4");
    }
    if(alien5.alive===true){
        removeElement("alien5");
    }  
    if(alien6.alive===true){
        removeElement("alien6");
    }
    if(alien7.alive===true){
        removeElement("alien7");
    }  
    if(alien8.alive===true){
        removeElement("alien8");
    }
    if(alien9.alive===true){
        removeElement("alien9");
    }  
    if(alien10.alive===true){
        removeElement("alien10");
    }
    if(alien11.alive===true){
        removeElement("alien11");
    }  
    if(alien12.alive===true){
        removeElement("alien12");
    }
    if(alien13.alive===true){
        removeElement("alien13");
    }
    if(alien14.alive===true){
        removeElement("alien14");
    }
    if(alien15.alive===true){
        removeElement("alien15");
    }
    if(alien16.alive===true){
        removeElement("alien16");
    }
    if(alien17.alive===true){
        removeElement("alien17");
    }
    if(alien18.alive===true){
        removeElement("alien18");
    }
    if(alien19.alive===true){
        removeElement("alien19");
    }
    if(alien20.alive===true){
        removeElement("alien20");
    }
    
    //go back to start game screen
    addTextElement("background", "H1", "gameTitle", "squish the aliens");
    addImageElement("background", "menuImage", ".\\images\\menuAlien.png");
    addImageElement("background", "menuImage2", ".\\images\\menuAlien2.png");

    
    // Create button
    addButtonElement("background", "startGameButton", startGameButton());*/
}



