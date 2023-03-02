const defaults = {
  technology:{total:0,income:0,invest:0},
  buildings:{house:3,hhouse:0,library:0,farm:2,stoneworks:0,workshops:0,mine:0,metalwork:0,barracks:0},
  defense:{walls:0},
  resource:{wains:1,stone:0},
  population:{working:40,free:10,max:0},
  money:{total:0,income:0},
  research:{mine:false,library:false,metalwork:false,windmill:false,hhouse:false,stoneworks:false,cwalls:false,buymulti:false},
  army:{total:0,income:0,mod:1}
}
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
let defense = localStorage.getItem("defense")
if(defense){
  defense=JSON.parse(defense)
}else{
  defense={walls:0}
  localStorage.setItem("defense",JSON.stringify({"walls":0}))
}
let resource = localStorage.getItem("resources")
if(resource){
  resource=JSON.parse(resource)
}else{
  resource={wains:1,stone:0}
  localStorage.setItem("resource",JSON.stringify({"wains":1,"stone":0}))
}
let population = localStorage.getItem("population")
if(population){
  population = JSON.parse(population)
}else{
  population = {working:40,free:10,max:0}
  localStorage.setItem("population",JSON.stringify({"working":0,"free":0,"max":0}))
}
let money = localStorage.getItem("money")
if(money){
  money = JSON.parse(money)
}else{
  money = {"total":0,"income":0}
  localStorage.setItem("money",JSON.stringify({"total":0,"income":0}))
}
let research = localStorage.getItem("research")
if(research){
  research = JSON.parse(research)
}else{
  research = {"mine":false,"library":false,"metalwork":false,"windmill":false,"hhouse":false,"stoneworks":false,"cwalls":false,"buymulti":false}
  localStorage.setItem("research",JSON.stringify({"mine":false,"library":false,"metalwork":false,"windmill":false,"hhouse":false,"stoneworks":false,"cwalls":false,"buymulti":false}))
}
let army = localStorage.getItem("army")
if(army){
  army=JSON.parse(army)
}else{
  army = {"total":0,"income":0,"mod":1}
  localStorage.setItem("army",JSON.stringify(army))
}
army.mod=1;
window.addEventListener("load",(event)=>{
  document.getElementById("closeModal").addEventListener("click",()=>{
    closeModal()
  })
  document.getElementById("attack").addEventListener("click",r=>{ 
    atack(Math.floor(Math.min(1.25,Math.max(0.4,Math.random()*2))*army.total),Number(Math.min(1.20,Math.max(0.60,Math.random()*2)).toFixed(2)))
  })
  const x = document.querySelectorAll(".t_option")
  if(research.windmill) document.getElementById("f_income").innerText = 4;
  if(!research.buymulti&&buildings.house>=100){
    document.getElementById("r_buymulti").style.display="block";
  }
  for(let reso in research){
    if(reso!="windmill" && research[reso]){
      let a = document.getElementById(reso).style.display = "block";
    }
  }
  x.forEach(tech=>{
    if(research[tech.id.split("_")[1]]) tech.style.display = "none";
  })
  let i = 0;
  x.forEach(tech=>{
    if(tech.style.display!="none") i++;
  })
  if(i==0){
    document.getElementById("complete").innerText="All research complete";
  } else {
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
function defInit() {
  if(army.max==0)return;
  defend(Math.floor(Math.min(1.4,Math.max(0.9,Math.random()))*army.total))
  let ms = (Math.max(0.5,Math.random()*5)) * 60000
  setTimeout(defInit, ms);
}
setTimeout(()=>{
  defInit()
},60000)
setInterval(()=>{ 
const b=JSON.parse(localStorage.getItem("buildings"))||{house:3,hhouse:0,library:0,farm:2,stoneworks:0,workshops:0,mine:0,metalwork:0,barracks:0};
money.income=0;
b.walls=defense.walls;
technology.income=0;
const multipliers = {farm: 2,mine: 7, metalwork: 17, workshop: 10, house: -1, barracks: -10, library:-2,hhouse:-2,stoneworks:7,walls:-4}
const tMultipliers = {library:4}
if(research.windmill)multipliers.farm=3;
for(let building in b){
    money.income+=Math.floor((multipliers[building]||0)*(b[building]||0))
    technology.income+=Math.floor((tMultipliers[building]||0)*(b[building]||0))
}
technology.income+=technology.invest;
if(money.total+money.income<0){
  money.total=0;
  money.income=0;
}
money.income+=Math.floor((population.free+population.working)/10);
money.total+=money.income;
population.max=(b.house*25)+(b.hhouse*70);
army.max=b.barracks*50;
technology.total+=research.library?(technology.income||0):Math.floor((technology.income||0)*1.1)
if(i%10==0){
    population.free+=Math.floor(population.max*0.10)
    if(population.free+population.working>population.max){
      population.free=population.max-population.working;
    }
    army.income=Math.floor(army.max*0.10)
    if(army.income+army.total>=army.max){
      army.total=army.max;
    }else{
      army.total+=army.income||0;
    }
}
i++;
updateDisplay()
},1000)
function UpdateStorage() {
  const items = ["technology", "buildings", "defense", "resource", "population", "money", "research", "army"];
  items.forEach(item => {
    localStorage.getItem(item) ? localStorage.setItem(item, JSON.stringify(eval(item))) : localStorage.setItem(item, JSON.stringify(defaults[item]));
  });
}
function updateDisplay(){
  const displayItems = [
    ["m_total", `${money.total.toFixed(0)}gl`],["m_income", `+${money.income.toFixed(0)}gl/day`],
    ["p_current", (population.free+population.working).toFixed(0)],["p_max", population.max.toFixed(0)],
    ["p_income", (population.free+population.working)==population.max?"+0pops/10 days":`+${Math.floor(population.max*0.10)}pops/10days`],["p_free", `${population.free.toFixed(0)} free pops`],
    ["r_weins", `${resource.wains.toFixed(0)} ore weins`],["r_ores", `${resource.stone.toFixed(0)} ores`],
    ["tp_total", `${technology.total.toFixed(0)}tp`],["tp_income", `+${technology.income.toFixed(0)}tp/day`],
    ["a_total", `${army.total}`],["a_max", `${army.max}army`],
    ["a_income", army.total==army.max?"+0army/10days":`+${army.income}army/10days`]
  ];
  [...document.getElementsByClassName("b_amount")].map(r=>{
    r.innerText=(buildings[r.id.split("_")[1]]||defense[r.id.split("_")[1]])||0;
  })
  displayItems.forEach(item => document.getElementById(item[0]).innerText = item[1]);
  UpdateStorage();
}
//navigation////////////
function typesNav(id) {
  ["economy", "p_free", "r_weins", "r_ores", "ecoNav", "technology", "techpoints", "Warfare", "invest", "complete", "army"].forEach(el => document.getElementById(el).style.display = "none");
  switch(id){
    case 1:
      ["economy", "p_free", "r_weins", "r_ores", "ecoNav"].forEach(el => document.getElementById(el).style.display = "block");
      break;
    case 2:
      ["technology", "techpoints", "invest", "complete"].forEach(el => document.getElementById(el).style.display = "block");
      break;
    case 3:
      ["Warfare", "army"].forEach(el => document.getElementById(el).style.display = "block");
      break;
  }
} 
//economy
function typesBuildings(id){
  var types = ["people", "industry", "military"];
  for (var i = 0; i < types.length; i++) {
      var display = (id - 1 == i) ? "block" : "none";
      document.getElementById(types[i]).style.display = display;
  }
}
//buildings////
/**
 * Buy Building
 * @param {Number} id 
 */
function buy(id) {

  const bu = [
    {id:1,name:"house",cost:100,pop:0,category:"buildings"},
    {id:2,name:"library",cost:1000,pop:0,category:"buildings"},
    {id:3,name:"hhouse",cost:200,pop:0,category:"buildings"},
    {id:4,name:"farm",cost:200,pop:20,category:"buildings"},
    {id:5,name:"mine",cost:500,pop:50,category:"buildings"},
    {id:6,name:"stoneworks",cost:2250,pop:0,category:"buildings"},
    {id:7,name:"metalwork",cost:1500,pop:40,category:"buildings"},
    {id:8,name:"workshop",cost:1000,pop:30,category:"buildings"},
    {id:9,name:"barracks",cost:1500,pop:25,category:"buildings"},
    {id:10,name:"walls",cost:4000,pop:0,category:"defense"},
  ];
  const building = bu.find(r => r.id == id);
  if (!building) return showModal({header:"Error",body:"Invalid item id."})
  if (building.cost > money.total || building.pop > population.free) {
    return showModal({header:"Insufficient funds",body:"Not enough money or free population."})
  }
  money.total -= building.cost;
  population.free -= building.pop;
  population.working += building.pop;
  if (building.category == "buildings") buildings[building.name]++;
  if (building.category == "defense") defense[building.name]++;
  updateDisplay();
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
    {id:9,name:"barracks",cost:1500,pop:25,category:"buildings"},
    {id:10,name:"walls",cost:4000,pop:0,category:"defense"},
  ]
  const building = bu.find(r => r.id == id);
  if (!building) return showModal({header:"Error",body:"Invalid item id"})
  if(building.category=="buildings"&&buildings[building.name]==0)return showModal({header:"Error",body:"You must have at least 1 of a building to demolish it"});
  if(building.category=="defense"&&defense[building.name]==0)return showModal({header:"Error",body:"You must have at least 1 of a building to demolish it"});
  money.total += building.cost * 0.4;
  population.working -= building.pop * 0.4;
  population.free += building.pop * 0.4;
  if(building.category=="buildings"){
    buildings[building.name]-=1;
  }
  if(building.category=="defense"){
    defense[building.name]-=1;
  }
  updateDisplay();
}
/**
 * Starts a defense
 * @param {Number} armiaW liczebność armi wroga
 */
function defend(armiaW) {
  let straty = Math.floor(Math.max(army.max* 0.1, Math.random() * army.max));
  if (army.total * army.mod > armiaW) {
    if (straty >= army.total) straty = Math.floor(Math.min(1,Math.max(0.7,Math.random()))*army.total);
    army.total-=straty;
    showModal({header:"Defense",body:"You defended against an enemy attack, but lost "+straty+" soldiers."})
  } else {
    if (straty >= army.total) {
      army.total = 0;
    } else {
      army.total -= straty;
    }
    let mloss = Math.floor(straty * (armiaW / 10));
    if (mloss >= money.total) {
      money.total = 0;
    } else {
      money.total -= mloss;
    }
    showModal({header:"Defense",body:"You were pillaged! the enemy killed "+straty+" of your soldiers and stole "+mloss+"Gl."})
  }
  updateDisplay();
}
/**
 * Starts a war
 * @param {Number} defArmy
 * @param {Number} defArmyMod
 */
function atack(defArmy,defArmyMod) {
  let straty,m,message;
  if(army.max==0)return showModal({header:"Error",body:"You must have at least 1 barrack to be able to attack."})
  if(defArmy*defArmyMod>army.total*army.mod){
    straty = army.total;
    m=0;
    message = `You were defeated, you lost ${straty} soldiers`;
  }else{
    straty = Math.floor(Math.min(0.5,Math.max(1,Math.random()*2))*(defArmy*defArmyMod))
    m=Math.floor(Math.max(1000,Math.min(3000,Math.random()*4000)));
    message=`You were victorious, you lost ${straty} soldiers, but got ${m} Gl`
  }
  army.total -= straty;
  money.total += m;
  showModal({header:"Attack",body:message,footer:`Enemy army size: ${Math.floor(defArmy*defArmyMod)}(x${defArmyMod})`})
}
//techs///////
function invest() {
  if (money.total < Math.floor(250*(technology.invest*1.0025))) return showModal({header:"Insufficient funds",body:`You need at least ${Math.floor(250*(technology.invest*1.0025))} gold to invest.`})
  money.total -= Math.floor(250*(technology.invest*1.0025));
  technology.invest++;
  technology.income++;
  updateDisplay();
}
/**
 * @param {Number} id
 */
function researchItem(id){
  const researches = [
    {name:"mine",cost:100},
    {name:"library",cost:300,TP_bonus:0.1},
    {name:"metalwork",cost:600,modDef:0.1},
    {name:"windmill",cost:900,FarmUpgrade:1,x:true},
    {name:"hhouse",cost:1500},
    {name:"stoneworks",cost:600},
    {name:"cwalls",cost:2000},
    {name:"buymulti",cost:5000,x:true}
  ]
  const item = researches[id-1]
  if(!item) return showModal({header:"Error",body:"Invalid research id"})
  if(research[item.name]) return item.x ? null : document.getElementById(item.name).style.display = "none"
  if(technology.total < item.cost) return showModal({header:"Insufficient funds",body:"You don't have enough techpoints."})
  if(!item.x) document.getElementById(item.name).style.display="block"
  document.getElementById("r_" + item.name).style.display = "none"
  technology.income += item.TP_bonus || 0
  army.mod += item.modDef || 0
  research[item.name] = true
  if(item.name=="windmill"){
    document.getElementById("r_hhouse").style.display="block";
  }
  if(item.name=="stoneworks"){
    document.getElementById("r_cwalls").style.display= "block";
  }
  if (![...document.querySelectorAll(".t_option")].some(r => r.style.display !== "none")) {
    document.getElementById("complete").innerText = "All research complete";
  }
  updateDisplay()
}
/**
 * 
 * @param {{header:String,body:String,footer:String}} data 
 */
function showModal(data){
  const modal = document.getElementById("myModal")
  document.getElementById("modal-header").innerHTML=data.header||"";
  document.getElementById("modal-body").innerHTML=data.body||"";
  document.getElementById("modal-footer").innerHTML=data.footer||"";
  modal.style.display="block";
}
function closeModal(){
  document.getElementById("myModal").style.display="none";
}
