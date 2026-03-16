let token = localStorage.getItem("token")

function show(screen){
document.querySelectorAll(".screen").forEach(s=>{
s.classList.remove("active")
})
document.getElementById(screen).classList.add("active")
}

async function handleLogin(e){
e.preventDefault()

const nfc_uid=document.getElementById("login-name").value
const password=document.getElementById("login-password").value

const res=await fetch(API_BASE+"/auditors/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
nfc_uid,
password
})
})

const data=await res.json()

if(data.token){
token=data.token
localStorage.setItem("token",token)
show("dashboard")
loadQueue()
}else{
alert("erro login")
}
}

async function loadQueue(){

const res=await fetch(API_BASE+"/events/dashboard",{
headers:{
Authorization:"Bearer "+token
}
})

const data=await res.json()

const container=document.getElementById("booths")
container.innerHTML=""

data.forEach(b=>{
const div=document.createElement("div")

div.innerHTML=`
<div class="event-card">
<b>${b.name}</b>
<button onclick="openAudit('${b.id}')">Auditar</button>
</div>
`

container.appendChild(div)
})
}

function openAudit(id){
document.getElementById("booth-id").value=id
show("audit")
}

async function submitAudit(e){

e.preventDefault()

const booth=document.getElementById("booth-id").value
const value_machine=document.getElementById("value-machine").value
const value_cash=document.getElementById("value-cash").value
const observation=document.getElementById("observation").value
const photos=document.getElementById("photos").files

const form=new FormData()

form.append("booth_id",booth)
form.append("value_machine",value_machine)
form.append("value_cash",value_cash)
form.append("observation",observation)

for(let i=0;i<photos.length;i++){
form.append("photos",photos[i])
}

await fetch(API_BASE+"/periodic",{
method:"POST",
headers:{
Authorization:"Bearer "+token
},
body:form
})

alert("auditoria enviada")

show("dashboard")
loadQueue()
}

document.addEventListener("DOMContentLoaded",()=>{

const vm=document.getElementById("value-machine")
const vc=document.getElementById("value-cash")

if(vm && vc){
vm.addEventListener("input",calc)
vc.addEventListener("input",calc)
}

})

function calc(){
const m=parseFloat(document.getElementById("value-machine").value||0)
const c=parseFloat(document.getElementById("value-cash").value||0)
document.getElementById("value-total").value=m+c
}
