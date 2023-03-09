const ignored = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAB9JREFUOE9jZKAQMFKon2HUAIbRMGAYDQNQPhr4vAAAJpgAEX/anFwAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAA9JREFUKFNjZCAAGEeGAgAFrAAJMBf+CwAAAABJRU5ErkJggg=="
]
const imgFiles = {
    player:["./sprites/characters/player.png"],
    slime:["./sprites/characters/slime.png"],
    chest:["./sprites/objects/chest.png"],
    objects:["./sprites/objects/objects.png"],
    particles:["./sprites/particles/dust_particles.png"],
    planks:["./sprites/tilesets/floors/wooden.png"],
    walls:["./sprites/tilesets/walls/walls.png","./sprites/tilesets/walls/wooden_door_b.png","./sprites/tilesets/walls/wooden_door.png"],
    decor:["./sprites/tilesets/decor_8x8.png","./sprites/tilesets/decor_16x16.png"],
    fences:["./sprites/tilesets/fences.png"],
    grass:["./sprites/tilesets/grass.png","./sprites/tilesets/plains.png","./sprites/tilesets/decor_16x16.png"]
}
let imgData = {
    player:[],
    slime:[],
    chest:[],
    objects:[],
    particles:[],
    planks:[],
    walls:[],
    decor:[],
    fences:[],
    grass:[],
}
let progress=0;
for(let i in imgFiles){
    for(let src of imgFiles[i]){
        const img = createImage(-1,-1,src)
        img.addEventListener("load",()=>{
            let size = src.includes("8x8")?8:16
            for(let a=0;a<=(img.height/size);a++){
                for(let j=0;j<=(img.width/size);j++){
                    const canvas = createCanvas(size,size);
                    const ctx = canvas.getContext("2d")
                    ctx.drawImage(img,(j-1)*size,(a-1)*size,size,size,0,0,size,size)
                    if(!ignored.some(r=>r==canvas.toDataURL())){
                        progress++;
                        imgData[i].push(createImage(size,size,canvas.toDataURL()))
                    }
                }
                loadingScreen(612,progress)
            }
            if(progress==612){
                imgData.objects=imgData.objects.filter((value,index)=>[0,5,10,11,16,43,59,80,81,82,96,97,98,104,105,112,113,114,118,119,120,121,122,123,128,129,130,134,135,136,137,138,139].includes(index))
                imgData.decor=imgData.decor.filter((value,index)=>![0,1,2,3,8,9,10,11,20,21,22,23,24,25,26,27,28,29,30,31].includes(index))
                imgData.grass=imgData.grass.filter((value,index)=>![4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].includes(index)&&index<65)
                console.log("All assets loaded...")
                loading()
            }
        })
    }
}
const background = createArray(71,144,[3,2,1,0,4],"fractal");
/**
 * @type {Array.<Array.<{type:"player"|"slime"|"chest"|"object"|"particle"|"plank"|"wall"|"decoration"|"fence"|"grass",id:Number,size:Number|undefined}|null>}
 */
const details = createArray(71,144);
class Chest{
    /**
     * @type {[Number,Number]}
     */
    position;
    constructor(y,x){
        details[y][x]={type:"chest",id:0}
        this.position=[y,x]
    }
    /**
     * executed `callback` after the chests opens
     * @param {function} callback
     */
    async open(callback){
        let i=0;
        const interval = setInterval(()=>{
            details[this.position[0]][this.position[1]]={type:"chest",id:i}
            if(i==3){
                clearInterval(interval)
                return callback()
            }
            i++;
        },100)
    }
}
class Player{
    /**
     * @type {[Number,Number]}
     */
    peaces=[];
    height;
    width;
    player;
    constructor(id,player=false){
        if(id<=36){
            this.height=2;
            this.width=2;
            this.peaces=[id + (6 * Math.floor(id / 6)), id + (6 * (Math.floor(id / 6) + 1))]
            this.player=player;
        }else{
            this.height=2;
            this.width=3;
            return showModal({header:"Error",body:"Invalid player layer id"})
        }
    }
    /**
     * 
     * @param {[Number,Number]} from 
     * @param {[Number,Number]} to 
     */
    walk(from,to){
    /**
     * @type {Array<Array<>>}
     */
    let map = []
    for(let i=0;i<71;i++){
    map.push(new Array(144).fill(0))
    }
    for(let i=0;i<71;i++){
    for(let j=0;j<144;j++){
        if(details[i][j]){
            map[i][j]=0;
        }else{
            map[i][j]=1;
        }
    }
    }
    var graph = new Graph(map);
    var start = graph.grid[from[0]][from[1]];
    var end = graph.grid[to[0]][to[1]];
    /**
     * @type {Array.<[Number,Number]>}
     */
    var result = astar.search(graph, start, end);
    result=result.map(r=>[r.y,r.x])
    let i=0;
    const interval = setInterval(()=>{
            let step=result[i];
            if(i>0){
                let prevStep = result[i-1];
                details[prevStep[1]][prevStep[0]]=0;
                details[prevStep[1]+1][prevStep[0]]=0; //23 - 29
            }

            details[step[1]][step[0]]={type:"player",id:new Player(24+i%6).peaces[0]}
            details[step[1]+1][step[0]]={type:"player",id:new Player(24+i%6).peaces[1]}
            if(i==result.length-2){
                return clearInterval(interval)
            }
            i++;
    },300)

    }
    draw(y,x){
        details[y][x]={type:"player",id:this.peaces[0]}
        details[y+1][x]={type:"player",id:this.peaces[1]}
    }
}
class Bed{
    height=2;
    width=1;
    draw(x,y){
        details[y][x]={type:"object",id:5}
        details[y+1][x]={type:"object",id:6}
    }
}
class Tree{
    peaces;
    height;
    width;
    constructor(id){
        if(id==1){
            this.width=3;
            this.height=4;
            this.peaces = [7,8,9,10,11,12,15,16,17,24,25,26];
        }
        if(id==2){
            this.width=2;
            this.height=2;
            this.peaces=[18,19,27,28];
        }
        if(id==3){
            this.width=2;
            this.height=3;
            this.peaces=[13,14,20,21,29,30]
        }
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    draw(x,y){
        let peace=0;
        for(let i=y;i<this.height+y;i++){
            for(let j=x;j<this.width+x;j++){
                details[i][j]={type:"object",id:this.peaces[peace]}
                peace++;
            }
        }
    }
}
for(let i=0;i<250;){
    const tree = new Tree(Math.floor(Math.max(1,Math.random()*4)))
    const x = Math.floor(Math.random()*144)
    const y = Math.floor(Math.min(21-tree.height,Math.random()*71))
    let occupied=false;
    for(let h=0;h<=tree.height;h++){
        for(let w=0;w<=tree.width;w++){
            if(details[y+h][x+w])occupied=true;
        }
    }
    if(!occupied){
        i++;
        tree.draw(x,y)
    }
}
for(let i=0;i<400;){
    const tree = new Tree(Math.floor(Math.max(1,Math.random()*4)))
    const x = Math.floor(Math.random()*(144-tree.width))
    const y = Math.floor(Math.random()*(71-tree.height))
    let occupied=false;
    for(let h=0;h<=tree.height;h++){
        for(let w=0;w<=tree.width;w++){
            if(details[y+h][x+w])occupied=true;
        }
    }
    if(!occupied){
        if(y>29){
            tree.draw(x,y)
            i++;
        }
    }
}
/**
 * @param {Number} width 
 * @param {Number} height 
 * @param {String} src 
 * @returns {HTMLImageElement}
 */
function createImage(width,height,src){
    let img = new Image()
    if(width>=0)img.width=width
    if(height>=0)img.height=height;
    img.src=src;
    return img
}
/**
 * @param {Number} width 
 * @param {Number} height 
 * @returns {HTMLCanvasElement}
 */
function createCanvas(width,height){
    let canvas = document.createElement("canvas")
    canvas.width=width;
    canvas.height=height;
    return canvas
}
/**
 * 
 * @param {Number} length1 
 * @param {Number} length2
 * @returns {Array.<Array.<null>>}
 */
function createArray(length1, length2, content = [], mode = 'default', blobAmount = 0, blobSize = 0) {
    const arr = []
    for (let i = 0; i < length1; i++) {
      arr.push(new Array(length2).fill(null))
    }
    if (mode == 'default') {
      if (content.length > 0) {
        for (let i = 0; i < length1; i++) {
          for (let j = 0; j < length2; j++) {
            arr[i][j] = content[Math.floor(Math.random() * content.length)]
          }
        }
      }
    }
    if (mode == "blob") {
      for (let i = 0; i < length1; i++) {
        for (let j = 0; j < length2; j++) {
          arr[i][j] = 4;
        }
      }
      for (let i = 0; i < blobAmount; i++) {
        let randY = Math.floor(Math.random() * length1)
        let randX = Math.floor(Math.random() * length2)
        arr[randY][randX] = content[0]
        let lastContentIndex = content.length - 1
        for (let j = 0; j < blobSize; j++) {
          const radius = j + 1
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const dist = Math.sqrt(dy * dy + dx * dx)
              if (dist <= radius) {
                const ry = randY + dy
                const rx = randX + dx
                if (ry >= 0 && ry < length1 && rx >= 0 && rx < length2) {
                  arr[ry][rx] = content[Math.floor(Math.random() * (lastContentIndex + 1))]
                }
              }
            }
          }
        }
      }
    }
    if (mode === "fractal") {
        if (content.length > 0) {
            for (let i = 0; i < length1; i++) {
              for (let j = 0; j < length2; j++) {
                arr[i][j] = 4;
              }
            }
          }
        const min = Math.min(length1, length2);
        const iterations = Math.floor(Math.log2(min)) - 1;
        const mid = min / 2;
        const range = content.length;
        // Set corner values
        arr[0][0] = content[0];
        arr[0][length2 - 1] = content[1];
        arr[length1 - 1][0] = content[2];
        arr[length1 - 1][length2 - 1] = content[3];
      
        // Run fractal algorithm
        for (let i = 0; i < iterations; i++) {
          const step = Math.floor(mid / Math.pow(2, i));
          const offset = Math.floor(step / 2);
          for (let y = offset; y < length1; y += step) {
            for (let x = offset; x < length2; x += step) {
              const a = arr[y - offset][x - offset];
              const b = arr[y - offset][x + offset];
              const c = arr[y + offset] ? arr[y + offset][x - offset] : arr[0][x - offset];
              const d = arr[y + offset] ? arr[y + offset][x + offset] : arr[0][x + offset];
              const e = (a + b + c + d) / 4 + (Math.random() * step * 2 - step);
              const rIndex = Math.floor(Math.random()*content.length)
              const wrappedE = content[Math.floor((e % range + range) % range)]?content[Math.floor((e % range + range) % range)]:content[rIndex];
              arr[y][x] = wrappedE;
            }
          }
        }
      }
    return arr;
  }
function loadingScreen(max,current){
    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = document.getElementById("eDisplay");
    var ctx = canvas.getContext("2d");
    ctx.font = "100px Arial";
    ctx.fillStyle="black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle="white"
    ctx.fillText(`${Math.floor((current/max)*100)}%`,(canvas.width/2)-100,canvas.height/2,canvas.width)
}
/**
 * @param {{name:String,prize:Array<{type:String,amount:{min:Number,max:Number}}>}|{name:String,loss:Array<{type:String,amount:{min:Number,max:Number}}>}} adventure 
 */
function initWorld(adventure){
    console.log(adventure.name)
    /**
     * @type {{type:String,amount:{min:Number,max:Number}}|null}
     */
    let prize=null;
    if(adventure.name=="Find chest"){
        if(adventure.prize){
            prize = adventure.prize[Math.floor(Math.random()*adventure.prize.length)]
            if(["gold","stone","technology"].includes(prize.type)){
                details[Math.max(24,Math.min(26,Math.random()*30))][Math.floor(Math.random()*144)]={type:"chest",id:0}
            }
        }
    }
    if(adventure.name=="Find villager"){
        new Player(0).draw(Math.floor(Math.max(23,Math.min(26,Math.random()*30))),Math.floor(Math.random()*144))
    }
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.getElementById("eDisplay")
    canvas.addEventListener("click", function(event) {
        const rect = canvas.getBoundingClientRect(); // Get the canvas bounding rectangle
        const x = event.clientX - rect.left; // Calculate the mouse x position relative to the canvas
        const y = event.clientY - rect.top; // Calculate the mouse y position relative to the canvas
        const indexX = Math.floor(x / 16); // Calculate the x index of the clicked cell
        const indexY = Math.floor(y / 16); // Calculate the y index of the clicked cell
        const clickedIndex = indexY * details[0].length + indexX; // Calculate the overall index of the clicked cell
        const clickedRow = Math.floor(clickedIndex / details[0].length);
        const clickedColumn = clickedIndex % details[0].length;
        if(["chest","player"].includes(details[clickedRow][clickedColumn]?.type)){
            if(details[clickedRow][clickedColumn]?.type=="chest"&&details[clickedRow][clickedColumn]?.id<3){
                new Chest(clickedRow,clickedColumn).open(()=>{
                    let header = "You oppened a chest";
                    let body = "default";
                    let footer = null;
                    if(prize.type=="gold"){
                        const m = Math.floor(Math.max(prize.amount.min,Math.min(prize.amount.max,Math.random()*(prize.amount.max+20))))
                        body = `You found ${m} gold in it.`
                        money.total+=m;
                    }
                    if(prize.type=="stone"){
                        const stone = Math.floor(Math.max(prize.amount.min,Math.min(prize.amount.max,Math.random()*(prize.amount.max+20))))
                        body = `You found ${stone} stone in it.`
                        resource.stone+=stone;
                    }
                    if(prize.type=="technology"){
                        const tp = Math.floor(Math.max(prize.amount.min,Math.min(prize.amount.max,Math.random()*(prize.amount.max+20))))
                        body = `You found ${tp} technology points in it.`
                        technology.total+=tp;
                    }
                    showModal({header,body,footer:footer?footer:""})
                })
            }
            if(details[clickedRow][clickedColumn]?.type=="player"){
                /**
                 * @type {{type:"population",amount:{min:Number,max:Number}}}
                 */
                let prize = adventure.prize[0]
                if(details[clickedRow+1][clickedColumn]?.type=="player"){
                    details[clickedRow][clickedColumn]=0;
                    details[clickedRow+1][clickedColumn]=0;
                }else{
                    details[clickedRow][clickedColumn]=0;
                    details[clickedRow-1][clickedColumn]=0;
                }
                let p = Math.floor(Math.max(prize.amount.min,Math.min(prize.amount.max,Math.random()*(prize.amount.max+20))))
                if(population.max<=population.free+population.working){
                    return showModal({header:"You found villagers.",body:"You asked them to join your city, but they refused, because it is full."})
                }
                if(population.max<=population.working+population.free+p){
                    p=(population.max-population.working)-population.free;
                    population.free+=p;
                }else{
                    population.free+=p;
                }
                return showModal({header:"You found villagers",body:`${p} villagers have joined your city.`})
                
            }
        }
      });
    canvas.width=16*144; 
    canvas.height=16*71;
    background[24] = new Array(144).fill(7)
    background[25] = new Array(144).fill(13)
    background[26] = new Array(144).fill(19)
    requestAnimationFrame(animation);   
}
const animation = () => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.getElementById("eDisplay")
    const ctx = canvas.getContext("2d")
    for(let i=1;i<71;i++){
        for(let j=1;j<144;j++){
            const img = getGrass(background[i-1][j-1])
            if(img){
                ctx.drawImage(img,(j-1)*16,(i-1)*16,16,16)
            }
        }
    }
    for(let i=1;i<71;i++){
        for(let j=1;j<144;j++){
            const pos = details[i-1][j-1]
            if(pos){
                let img;
                switch(pos.type){
                    case"player":{
                        img=getPlayer(pos.id)
                        break;
                    }
                    case"slime":{
                        img=getSlime(pos.id)
                        break;
                    }
                    case"chest":{
                        img=getChest(pos.id)
                        break;
                    }
                    case"object":{
                        img=getObject(pos.id)
                        break;
                    }
                    case"particle":{
                        img=getSlime(pos.id)
                        break;
                    }
                    case"plank":{
                        img=getPlank()
                        break;
                    }
                    case"wall":{
                        img=getWall(pos.id)
                        break;
                    }
                    case"decoration":{
                        img=getDecoration(pos.id)
                        break;
                    }
                    case"fence":{
                        img=getFence(pos.id)
                        break;
                    }
                    case"grass":{
                        img=getGrass(pos.id)
                        break;
                    }
                }
                if(img){
                    ctx.drawImage(img,(j-1)*16,(i-1)*16,16,16)
                }
            }

        }
    }
    requestAnimationFrame(animation)
}
function loading(){
    i=0;
    const interval = setInterval(()=>{
        if(i<=153){
            if(i==153){
                initWorld(adventures[Math.floor(Math.random()*adventures.length)])
                clearInterval(interval)
            }else{
                loadingScreen(153,i)
                i++;
            }
        }
    })
    
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getPlayer(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.player.length)
    return imgData.player[id]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getSlime(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.slime.length)
    return imgData.slime[id]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getChest(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.chest.length)
    return imgData.chest[id]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getObject(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.objects.length)
    return imgData.objects[id]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getParticle(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.particles.length)
    return imgData.particles[id]
}
/**
 * @returns {HTMLImageElement}
 */
function getPlank(){
    return imgData.planks[0]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getWall(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.walls.length)
    return imgData.walls[id]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getDecoration(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.decor.length)
    return imgData.decor[id]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getFence(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.fences.length)
    return imgData.fences[id]
}
/**
 * @param {Number} id 
 * @returns {HTMLImageElement}
 */
function getGrass(id){
    if(id==null||id==undefined)id=Math.floor(Math.random()*imgData.grass.length)
    return imgData.grass[id]
}
setInterval(()=>{
initWorld(adventures[Math.floor(Math.random()*adventures.length)])
},30000)