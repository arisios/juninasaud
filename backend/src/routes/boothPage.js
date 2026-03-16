const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/b/:booth_id', async (req, res) => {

  try {

    const { booth_id } = req.params;

    const result = await pool.query(
      `SELECT b.id,b.name,e.name as event_name
       FROM booths b
       JOIN events e ON b.event_id = e.id
       WHERE b.id = $1`,
      [booth_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Barraca não encontrada');
    }

    const booth = result.rows[0];

    res.send(`
<!DOCTYPE html>
<html>
<head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${booth.name}</title>

<style>

body{
font-family:Arial;
padding:20px;
background:#f2f2f2
}

.card{
background:white;
padding:20px;
border-radius:10px
}

input,textarea,button{
font-size:18px;
padding:10px;
margin-top:10px;
width:100%
}

</style>

</head>

<body>

<div class="card">

<h2>${booth.name}</h2>
<p>Evento: ${booth.event_name}</p>

<h3>Registrar Auditoria</h3>

<label>Valor máquina</label>
<input id="machine" type="number">

<label>Valor dinheiro</label>
<input id="cash" type="number">

<label>Observação</label>
<textarea id="obs"></textarea>

<label>Fotos</label>
<input type="file" id="photos" multiple accept="image/*" capture="environment">

<button onclick="send()">Salvar Auditoria</button>

</div>

<script>

async function send(){

const machine=document.getElementById('machine').value
const cash=document.getElementById('cash').value
const obs=document.getElementById('obs').value
const photos=document.getElementById('photos').files

const form=new FormData()

form.append("booth_id","${booth.id}")
form.append("value_machine",machine)
form.append("value_cash",cash)
form.append("observation",obs)

for(let i=0;i<photos.length;i++){
form.append("photos",photos[i])
}

await fetch("/periodic",{
method:"POST",
headers:{
Authorization:"Bearer "+localStorage.getItem("token")
},
body:form
})

alert("Auditoria registrada")

}

</script>

</body>
</html>
`);

  } catch (err) {
    res.status(500).send('Erro interno');
  }

});

module.exports = router;
