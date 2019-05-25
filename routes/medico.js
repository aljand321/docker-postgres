const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

var idCIta
router.get('/HomeVistDoctor',(req, res) => {
    fetch('http://localhost:3000/api/reg_citas/')
      .then(resp => resp.json())
      .then(resp =>{
          idCIta = resp[0].id;
          console.log(idCIta)
        res.render('HomeVistDoctor',{resp});
    });
});
var dataPaciente
router.get('/consulta/:id', (req,res) => {
    var id = req.params;
    fetch('http://localhost:3000/api/onlyPaciente/'+id.id)
      .then(resp => resp.json())
      .then(resp =>{
        dataPaciente = resp;
        res.redirect('/medico/renderConsulta');       
    });
});

router.get('/renderConsulta', (req,res)=> {
    if (dataPaciente == null){
        res.redirect('/medico/HomeVistDoctor')
    }else{
        res.render('consultaMedica',{
            dataPaciente,
            idCIta
        });   
    }     
});

router.post('/regConsulta/:id', (req, res) => {
    var citaID = req.params;
    console.log(citaID," es esto<<<<<<<<<<<<<<<<<<<")
    var datos = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3000/api/reg_consulta/'+citaID.id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {      
      res.redirect('/medico/renderConsulta');
    })
});

module.exports = router;