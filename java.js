
let technology = localStorage.getItem("technology")
if(technology){
  technology = JSON.parse(technology)
}else{
  technology = {total:0,income:0,invest:0}
  localStorage.setItem("technology",JSON.stringify({"total":0,"income":0,"invest":0}))
}
let buildings = localStorage.getItem("buildings");
if(buildings){
buildings = JSON.parse(buildings)
}else{
  buildings = {house:3,hhouse:0,library:0,farm:2,stoneworks:0,workshops:0,mine:0,metalwork:0,barracks:0}
  localStorage.setItem("buildings",JSON.stringify({"house":3,"hhouse":0,"library":0,"farm":2,"stoneworks":0,"workshops":0,"mine":0,"metalwork":0,"barracks":0}))
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
  population = {"working":40,"free":10,"max":0}
  localStorage.setItem("population",JSON.stringify({"working":0,"free":0,"max":0}))
}
let money = localStorage.getItem("money")
if(money){
  money = JSON.parse(money)
}else{
  money = {"total":0,"income":0}
  localStorage.setItem("money",JSON.stringify({"total":0,"income":0}))
}
let rs = localStorage.getItem("research")
if(rs){
  rs = JSON.parse(rs)
}else{
  rs = {"mine":false,"library":false,"metalwork":false,"windmill":false,"hhouse":false,"stoneworks":false,"cwalls":false}
  localStorage.setItem("research",JSON.stringify({"mine":false,"library":false,"metalwork":false,"windmill":false,"hhouse":false,"stoneworks":false,"cwalls":false}))
}
window.addEventListener("load",(event)=>{
    const x = document.querySelectorAll(".t_option")
    if(rs.windmill)document.getElementById("f_income").innerText=4;
    for(let reso in rs){
      if(reso!="windmill"&&rs[reso]){
        let a = document.getElementById(reso).style.display="block";
      }
    }
    x.forEach(tech=>{
      if(rs[tech.id.split("_")[1]])tech.style.display="none";
    })
    let i=0;
    x.forEach(tech=>{
      if(tech.style.display!="none")i++;
    })
    if(i==0){
      document.getElementById("complete").innerText="All research complete";
    }else{
      document.getElementById("complete").innerText="";
    }
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
    updateDisplay()
})
let i=0;
setInterval(()=>{
const b=JSON.parse(localStorage.getItem("buildings"))||{house:3,hhouse:0,library:0,farm:2,stoneworks:0,workshops:0,mine:0,metalwork:0,barracks:0};
money.income=0;
b.walls=def.cwalls;
technology.income=0;
const multipliers = {farm: 2,mine: 7, metalwork: 17, workshop: 10, house: -1, barracks: -10, library:-2,hhouse:-2,stoneworks:7,walls:-4}
const tMultipliers = {library:4}
if(rs.windmill)multipliers.farm=3;
for(let building in b){
    money.income+=Math.floor((multipliers[building]||0)*(b[building]||0))
    technology.income+=Math.floor((tMultipliers[building]||0)*(b[building]||0))
}
technology.income+=technology.invest;
money.income+=Math.floor((population.free+population.working)/10);
money.total+=money.income;
population.max=(b.house*25)+(b.hhouse*70);
technology.total+=rs.library?(technology.income||0):Math.floor((technology.income||0)*1.1)
if(i%10==0){
    population.free+=Math.floor(population.max*0.10)
    if(population.free+population.working>population.max){
      population.free=population.max-population.working;
    }
}
i++;
updateDisplay()
},1000)
function UpdateStorage(){
  localStorage.getItem("technology")?localStorage.setItem("technology",JSON.stringify(technology)):localStorage.setItem("technology",JSON.stringify({"total":0,"income":0,"invest":0}))
  localStorage.getItem("buildings")?localStorage.setItem("buildings",JSON.stringify(buildings)):localStorage.setItem("buildings",JSON.stringify({"house":3,"hhouse":0,"library":0,"farm":2,"stoneworks":0,"workshops":0,"mine":0,"metalwork":0,"barracks":0}))
  localStorage.getItem("defense")?localStorage.setItem("defense",JSON.stringify(def)):localStorage.setItem("defense",JSON.stringify({"walls":0,"army":0}))
  localStorage.getItem("resources")?localStorage.setItem("resources",JSON.stringify(resource)):localStorage.setItem("resources",JSON.stringify({"wains":1,"stone":0}))
  localStorage.getItem("population")?localStorage.setItem("population",JSON.stringify(population)):localStorage.setItem("population",JSON.stringify({"free":0,"working":0,"max":0}))
  localStorage.getItem("money")?localStorage.setItem("money",JSON.stringify(money)):localStorage.setItem("money",JSON.stringify({"total":0,"income":0}))
  localStorage.getItem("research")?localStorage.setItem("research",JSON.stringify(rs)):localStorage.setItem("research",JSON.stringify({"mine":false,"library":false,"metalwork":false,"windmill":false,"hhouse":false,"stoneworks":false,"cwalls":false}))
}
function updateDisplay(){
  document.getElementById("m_total").innerText=`${money.total.toFixed(0)}gl`;
  document.getElementById("m_income").innerText=`+${money.income.toFixed(0)}gl/day`;
  document.getElementById("p_current").innerText=(population.free+population.working).toFixed(0);
  document.getElementById("p_max").innerText=population.max.toFixed(0);
  document.getElementById("p_income").innerText=(population.free+population.working)==population.max?"+0pops/10 days":`+${Math.floor(population.max*0.10)}pops/10days`
  document.getElementById("p_free").innerText=`${population.free.toFixed(0)} free pops`;
  document.getElementById("r_weins").innerText=`${resource.wains.toFixed(0)} ore weins`;
  document.getElementById("r_ores").innerText=`${resource.stone.toFixed(0)} ores`;
  document.getElementById("tp_total").innerText=`${technology.total.toFixed(0)}tp`;
  document.getElementById("tp_income").innerText=`+${technology.income.toFixed(0)}tp/day`;
  UpdateStorage()
}
//navigation////////////
function typesNav(id) {
    var economy = document.getElementById("economy");
    var freepops = document.getElementById("p_free");
    var weins = document.getElementById("r_weins");
    var ores = document.getElementById("r_ores");
    var ecoNav = document.getElementById("ecoNav");
    var technology = document.getElementById("technology");
    var techpointsNaw= document.getElementById("techpoints");
    var wafare=document.getElementById("Warfare");
    var invest=document.getElementById("invest")
    var complete=document.getElementById("complete")
    switch(id){
    case 1:
      economy.style.display = "block";
      freepops.style.display = "block";
      weins.style.display = "block";
      ores.style.display = "block";
      ecoNav.style.display = "block";
      technology.style.display = "none";
      techpointsNaw.style.display = "none";
      wafare.style.display = "none";
      invest.style.display = "none";
      complete.style.display = "none";  
    break;
    case 2:
      economy.style.display = "none";
      freepops.style.display = "none";
      weins.style.display = "none";
      ores.style.display = "none";            
      ecoNav.style.display = "none";
      technology.style.display = "block";
      techpointsNaw.style.display = "block";
      wafare.style.display = "none";
      invest.style.display = "block";
      complete.style.display = "block";
    break;
    case 3:
      economy.style.display = "none";
      freepops.style.display = "none";
      weins.style.display = "none";
      ores.style.display = "none";            
      ecoNav.style.display = "none";
      technology.style.display = "none";
      techpointsNaw.style.display = "none";
      wafare.style.display = "block";
      invest.style.display = "none";
      complete.style.display = "none";
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
/**
 * Buy Building
 * @param {Number} id 
 */
function buy(id){
  const bu = [
    {id:1,name:"house",cost:100,pop:0,category:"buildings"},
    {id:2,name:"library",cost:1000,pop:0,category:"buildings"},
    {id:3,name:"hhouse",cost:200,pop:0,category:"buildings"},
    {id:4,name:"farm",cost:200,pop:20,category:"buildings"},
    {id:5,name:"mine",cost:500,pop:50,category:"buildings"},
    {id:6,name:"stoneworks",cost:2250,pop:0,category:"buildings"},
    {id:7,name:"metalwork",cost:1500,pop:40,category:"buildings"},
    {id:8,name:"workshop",cost:1000,pop:30,category:"buildings"},
    {id:9,name:"barracks",cost:1500,pop:25,category:"defense"},
    {id:10,name:"cwalls",cost:4000,pop:0,category:"defense"},
  ]
  const building = bu.filter(r=>r.id==id)[0]
  if(!building)return alert("Invalid id!")
  if(building.cost>0&&building.cost>money.total)return alert("Not enough money!")
  if(building.pop>0&&building.pop>population.free)return alert("Not enough free population")
  if(building.cost!=0){
    money.total-=building.cost;
  }
  if(building.pop!=0){
    population.free-=building.pop;
    population.working+=building.pop;
  }
  if(building.category=="buildings"){
    buildings[building.name]+=1;
  }
  if(building.category=="defense"){
    def[building.name]+=1;
  }
  updateDisplay()
}
function Demolish(id){
  const bu = [
    {id:1,name:"house",cost:100,pop:0,category:"buildings"},
    {id:2,name:"library",cost:1000,pop:0,category:"buildings"},
    {id:3,name:"hhouse",cost:200,pop:0,category:"buildings"},
    {id:4,name:"farm",cost:200,pop:20,category:"buildings"},
    {id:5,name:"mine",cost:500,pop:50,category:"buildings"},
    {id:6,name:"stoneworks",cost:2250,pop:0,category:"buildings"},
    {id:7,name:"metalwork",cost:1500,pop:40,category:"buildings"},
    {id:8,name:"workshop",cost:1000,pop:30,category:"buildings"},
    {id:9,name:"barracks",cost:1500,pop:25,category:"defense"},
    {id:10,name:"cwalls",cost:4000,pop:0,category:"defense"},
  ]
  const building = bu.filter(r=>r.id==id)[0]
  if(!building)return alert("Invalid id")
  if(buildings[building.name]==0)return;
  money.total+=building.cost*0.4
  population.working-=building.pop*0.4;
  population.free+=building.pop*0.4;
  if(building.category=="buildings"){
    buildings[building.name]-=1;
  }
  if(building.category=="defense"){
    def[building]-=1;
  }
  updateDisplay()
}
//warfare//////////////////////////////
// let modDef=0.1;
// let destruction;
// let timeUntilAttack=Math.random()*999999999999+60000;
// let straty;
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
// let straty;
// if(def.army*modDef>armiaW){
// straty=def.army*(random()* (0.50 - 0.10) + 0.10)-(def.army*modDef);
// armia-=straty;
// alert("You were victorius, you lost "+straty+" army");
// }
// else{
//   straty=armia*(Math.random()* (0.90 - 0.50) + 0.40)-(def.army*modDef);
//   if(straty>=def.army){
//   def.army=0;
//   }
//   else{
//   def.army-=straty;
//   }
//     income-=(straty*(armiaW/10));
// alert("You were defeted, you lost "+straty+" army and "+(straty*armiaW/10)+" Gl ");
// }
}
/**
 * @param {Number} defArmy
 * @param {Number} derArmyMod
 */
function atack(defArmy,defArmyMod){
// if(armi>defArmy*defArmyMod){
//   straty=armia*(Math.random()* (0.30 - 0.10) + 0.10);
//   money=Math.random()*(3000-1000)+1000;
// income+=money;
// alert("You were victorius, you lost "+straty+" army and get "+money+"Gl");
// }else{
//   straty=armia*(Math.random()* (0.90 - 0.30) + 0.30)+defArmy*defArmyMod/2;
//   armia-=straty;
// alert("You were defeted, you lost "+straty+" army");
// }
}
//techs///////
function invest(){
    if(money.total>=250){
      technology.invest+=1;
      technology.income+=1;
      money.total-=250;
    }else{
      alert("Not enought money my King, you need at least "+250+"Gl")
    }
    updateDisplay()
}
/**
 * @param {Number} id
 */
function research(id){
  const researches = [
    {name:"mine",cost:100},
    {name:"library",cost:300,TP_bonus:0.1},
    {name:"metalwork",cost:600,modDef:0.1},
    {name:"windmill",cost:900,FarmUpgrade:1},
    {name:"hhouse",cost:1500},
    {name:"stoneworks",cost:600},
    {name:"cwalls",cost:2000},
  ]
  const item = researches[id-1]
  if(!item)return alert("Invalid id")
  if(rs[item.name]){
    if(item.name!="windmill")document.getElementById(item.name).style.display = "none";
    return; 
  }
  if(technology.total>=item.cost){
    if(item.name!="windmill"){
      document.getElementById(item.name).style.display="block";
    }
    document.getElementById("r_"+item.name).style.display = "none";
    technology.income+=item.TP_bonus||0;
    //modDef+=item.modDef||0;
    rs[item.name]=true;
  }else{
    alert("Not enough tech points")
  }
  const t_options = document.querySelectorAll(".t_option")
  let j = 0;
  t_options.forEach(r=>{
    if(r.style.display!="none")j=1;
  })
  if(j==0){
    document.getElementById("complete").innerText="All research complete";
  }
  updateDisplay()
}