let buildings = localStorage.getItem("buildings");
if(buildings){
buildings = JSON.parse(buildings)
}else{
  buildings = {house:2,hhouse:0,library:0,farm:2,stoneworks:0,workshops:0,mine:0,metalworks:0,barracks:0}
  localStorage.setItem("buildings",JSON.stringify({"house":2,"hhouse":0,"library":0,"farm":2,"stoneworks":0,"workshops":0,"mine":0,"metalworks":0,"barracks":0}))
}
let def = localStorage.getItem("defense")
if(def){
  def=JSON.parse(def)
}else{
  def={walls:0,army:0}
  localStorage.setItem("defense",JSON.stringify({"walls":0,"army":0}))
}
let resource = localStorage.getItem("resources")
if(resource){
  resource=JSON.parse(resource)
}else{
  resource={wains:1,stone:0}
  localStorage.setItem("resources",JSON.stringify({"wains":1,"stone":0}))
}
let population = localStorage.getItem("population")
if(population){
  population = JSON.parse(population)
}else{
  population = {"working":0,"free":0,"max":0}
  localStorage.setItem("population",JSON.stringify({"working":0,"free":0,"max":0}))
}
window.addEventListener("load",(event)=>{
    const navbar = document.querySelectorAll(".navButton")
    navbar.forEach(node=>{
       node.addEventListener("click",(event)=>{
        if(event.target.id.startsWith("nav")){
            typesNav(parseInt(event.target.id.split("_")[1]))
            navbar.forEach(r=>{
              if(r.id.includes("nav")){
                r.classList.remove("selected")
              }
            })
            node.classList.toggle("selected")
        }
        if(event.target.id.startsWith("bud")){
            typesBuildings(parseInt(event.target.id.split("_")[1]))
            navbar.forEach(r=>{
              if(r.id.includes("bud")){
                r.classList.remove("selected")
              }
            })
            node.classList.toggle("selected")
        }
       })
    })
    loadMoney()
})
let i=0;
setInterval(()=>{
const b= localStorage.getItem("buildings")||{house:2,hhouse:0,library:0,farm:2,stoneworks:0,workshops:0,mine:0,metalworks:0,barracks:0};
let income = 0;
const multipliers = {farm: 2,mine: 7, metalworks: 17, workshop: 10, house: -1, barracks: -10}
for(let building in b){
    income+=(multipliers[building]||0)*b[building]
    const money = parseInt(document.getElementById("m_total").innerText);
    console.log(money,"$")
}
if(i%10==0){
    editLocalStorage("max","population",b.house*25)
    editLocalStorage("free","population",(population.free||0+population.working||0)+((population.max*0.10)||0))    
}
i++;
},1000)
//navigation////////////
function typesNav(id) {
    var economy = document.getElementById("economy");
    var freepops = document.getElementById("freepops");
    var weins = document.getElementById("weins");
    var ores = document.getElementById("ores");
    var ecoNav = document.getElementById("ecoNav");
    var technology = document.getElementById("technology");
    var techpointsNaw= document.getElementById("techpoints");
    switch(id){
    case 1:
        economy.style.display = "block";
            freepops.style.display = "block";
            weins.style.display = "block";
            ores.style.display = "block";
            ecoNav.style.display = "block";
        technology.style.display = "none";
            techpointsNaw.style.display = "none";
        
    break;
    case 2:
        economy.style.display = "none";
            freepops.style.display = "none";
            weins.style.display = "none";
            ores.style.display = "none";            
            ecoNav.style.display = "none";
        technology.style.display = "block";
            techpointsNaw.style.display = "block";
    break;
    }
} 
//economy
function typesBuildings(id){
    var people = document.getElementById("people");
    var industrial = document.getElementById("industry");
    var military=document.getElementById("military");
    switch(id){
    case 1:
    people.style.display = "block";
    industrial.style.display = "none";
    military.style.display = "none";
    break;
    case 2:
    people.style.display = "none";
    industrial.style.display = "block";
    military.style.display = "none";
    break;
    case 3:
    people.style.display = "none";
    industrial.style.display = "none";
    military.style.display = "block";
    break;
}
}
//buildings////
let farmsAmount=buildings.farms||2;
let houseAmount=buildings.house||3;
let liblaryAmount=buildings.library||0;
let HugeHouseAmount=buildings.hhouse||0;
let mineAmount=buildings.house||0;
let metalworksAmount=buildings.metalworks||0;
let stonewoksAmount=buildings.stoneworks||0;
let workshopAmount=buildings.workshops||0;
let CWalls=def.walls||0;
let weins=resource.wains||1;
let stone=resource.stone||0;
let wokingPops=population.working||0;
let FarmUpgrade=0;
function Build(id){
    if(freepops>=20&&money>=200&&id==1){
      modifier+=2+FarmUpgrade;
      farmsAmount++;
      freepops-=20-FarmUpgrade*2;
      money-=200;
    }
    else if(money>100&&id==2){
      modifier-=1;
      houseAmount++;
      maxpopulation+=25;
      money-=100;
    }
    else if(money>500&&weins>0&&id==3){
      if(ore<0&&metalworksAmount>mineAmount){
        modifier+=20-3;
      }
      modifier+=7;
      mineAmount++;
      freepops-=50;
      money-=500;
      weins--;      
      ore++;
    }
    else if(money>1500&&ore>0&&id==4){
      modifier+=20-3;
      metalworksAmount++;
      freepops-=40;
      ore--;
      money-=1500;
    }
    else if(money>1000&&population>75*workshopsAmount&&id==5){
      
      modifier+=10;
      workshopsAmount++;
      freepops-=30;
      money-=1000;
    }
    else if(money>1000&&freepops>20&&id==6){
      modifier-=10;
      baraksAmount++;
      freepops-=20;
      money-=1000;
      maxarmy+=50;
    }
    else if(money>2250&&freepops>50&&weins>0&&id==7){
        modifier+=7;
        stonewoksAmount++;
        freepops-=50;
        money-=2250;
        weins--;
        stone++;
    }
    else if(money>4000&&population>300&&stone>0&&id==8){
        modifier-=4;
        CWall++;
        money-=4000;
        modDef+=0.10;
        document.getElementById(CityWalls).style.display=none;
    }
    else if(money>1000&&population>100*liblaryAmount0&&id==9){
        modifier-=2;
        liblaryAmount++;
        money-=1000;
        TP_income+=2;
    }
    else if(money>200&&id==10){
        modifier-=2;
        HugeHouseAmount++;
        money-=200;
        maxpopulation+=70;
    }
    invent()
    wokingPops=population-freepops;
    }
    function Demolish(id){
    if(farmsAmount>0&&id==1){
      modifier-=2;
      farmsAmount--;
      freepops+=20;
      money+=200*demolishingMod;
    }
    else if(farmsAmount>0&&id==2){
      modifier+=1;
      houseAmount--;
      maxpopulation-=25;
      money+=100*demolishingMod;
    }
    else if(mineAmount>0&&id==3){
      modifier-=7;
      mineAmount--;
      freepops+=50;
      money+=500*demolishingMod;
      weins++;
      ore--;
      if(ore<0){
        alert("too few ore, we can't supply metalworks");
        modifier-=20-3;
      }
    }
    else if(mineAmount>0&&ore>0&&id==4){
      modifier-=20-3;
      metalworksAmount--;
      freepops+=40;
      ore++;
      money+=1500*demolishingMod;
    }
    else if(workshopAmount>0&&id==5){
      modifier-=10;
      workshopAmount--;
      freepops+=30;
      money+=1000*demolishingMod;
    }
    else if(baraksAmount>0&&id==6){
      freepops+=20;
      maxarmy-=50;
      baraksAmount--;
      money+=1000*demolishingMod;
    }      
    else if(stonewoksAmount>0&&id==7){
        modifier-=7;
        stonewoksAmount--;
        freepops+=50;
        money+=2250*demolishingMod;
        weins++;
        stone--;
    }
    else if(liblaryAmount>0&&id==9){
        modifier+=2;
        liblaryAmount--;
        money+=1000*demolishingMod;
        TP_income-=2;
        techpoints-=50;
        if(techpoints<0)techpoints=0;
    }
    else if(money>200&&id==10){
        modifier-=2;
        HugeHouseAmount--;
        money+=200*demolishingMod;
        maxpopulation-=70;
    }
    wokingPops=population-freepops;
}
//warfare//////////////////////////////
let modDef=0.1;
let destruction;
let timeUntilAttack=Math.random()*999999999999+60000;
let straty;
/*
setInterval(() => {
  alert('You have been atacked!');
  defense(Math.random()*(100));
}, timeUntilAttack);
*/
/**
 * @param {Number} armiaW liczebność armi wroga
 */
function defense(armiaW){
let straty;
if(def.army*modDef>armiaW){
straty=def.army*(random()* (0.50 - 0.10) + 0.10)-(def.army*modDef);
armia-=straty;
alert("You were victorius, you lost "+straty+" army");
}
else{
  straty=armia*(Math.random()* (0.90 - 0.50) + 0.40)-(def.army*modDef);
  if(straty>=def.army){
  def.army=0;
  }
  else{
  def.army-=straty;
  }
    income-=(straty*(armiaW/10));
alert("You were defeted, you lost "+straty+" army and "+(straty*armiaW/10)+" Gl ");
}
editLocalStorage("army","defense",def.army)
}
/**
 * @param {Number} defArmy
 * @param {Number} derArmyMod
 */
function atack(defArmy,defArmyMod){
if(armi>defArmy*defArmyMod){
  straty=armia*(Math.random()* (0.30 - 0.10) + 0.10);
  money=Math.random()*(3000-1000)+1000;
income+=money;
alert("You were victorius, you lost "+straty+" army and get "+money+"Gl");
}else{
  straty=armia*(Math.random()* (0.90 - 0.30) + 0.30)+defArmy*defArmyMod/2;
  armia-=straty;
alert("You were defeted, you lost "+straty+" army");
}
}
//techs///////
let techpoints=0;
let TP_income=0;
let TP_bonus=0;
let investAmount=1;
techpoints+=TP_income*TP_bonus;
const researches = [
  {name:"mine",cost:100},
  {name:"liblary",cost:300,TP_bonus:0.1},
  {name:"metalwork",cost:600,modDef:0.1},
  {name:"Windmill",cost:900,FarmUpgrade:1},
  {name:"HugeHouse",cost:1500},
  {name:"stoneworks",cost:600},
  {name:"CityWalls",cost:2000},
]
function invest(){
    if(money>250*investAmount){
        TP_income+=1;
    }else{
        document.getElementById("comunicatTech").innerText="Not enought money my King, you need at least "+250*investAmount+"Gl";
    }
    
}
/**
 * @param {Number} id
 */
function research(id){
  const item = researches[id-1]
    if(techpoints>=item.cost){
        document.getElementById(item.name).style.display = "block";
        TP_income+=item.TP_bonus||0;
        modDef+=item.modDef||0;
        FarmUpgrade+=item.FarmUpgrade||0;
        if(item.FarmUpgrade&&FarmUpgrade==1){
          income+=farmsAmount;
          freepops+=farmsAmount*2;
        }
    }
}
function invent(){
    if(mineAmount>=1){
        alert("Check your tech tree");
        document.getElementById(tech3).style.display = "block";
    }
    if(stone>=1){
        alert("Check your tech tree");
        document.getElementById(tech7).style.display = "block";
    }
    if(liblaryAmount>=1){
        alert("Check your tech tree");
        document.getElementById(tech5).style.display = "block";
    }
}
/**
 * Loads money from `localStorage`
 */
function loadMoney(){
  const money = localStorage.getItem("money")||0;
  document.getElementById("m_total").innerText=money;
}
/**
 * Edits `localStorage`
 * @param {String} property 
 * @param {String} origin
 * @param {Object} data
 * @returns {void}
 */
function editLocalStorage(property,origin,data){

  let d=localStorage.getItem(origin)
  if(!d){
    d = {[property]:data}
    console.log(d)
  }else{
    d[property]=data;
  }
  localStorage.setItem(origin,d)
}
