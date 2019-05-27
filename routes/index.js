const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/',(req, res) => {
  res.render('index')
});

router.get('/home',(req, res) => {
  res.render('home')
});

router.post('/login', (req,res)  => {
  var data = req.body;
  var enviar = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type' : "application/json"
    }
  }
  fetch('http://localhost:4500/api/login',enviar)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    if(resp.success == false){
      res.send('usted no esta registrado')
    }else{
      res.redirect('/home')
    }
    
  })
})

router.get('/cuadernos',(req, res) => {
  res.render('cuadernos')
});
 //vista de doctor

 
// Historiales Clinicos
router.get('/expediente',(req, res) => {
  res.render('expediente')
});


router.get('/vistaPrimPaciente',(req, res) => {
  res.render('vistaPrimPaciente')
});

router.get('/ListaPacienteDoc',(req, res) => {
  res.render('ListaPacienteDoc')
});

//hospitalizacion 
router.get('/hospitalizacion',(req, res) => {
  res.render('hospitalizacion')
});

router.get('/Papeleta_Inter',(req, res) => {
  res.render('Papeleta_Inter')
});

// Internacion
router.get('/salas',(req, res) => {
  res.render('salas')
});

router.get('/camas',(req, res) => {
  res.render('camas')
});

router.get('/paciente_Inter',(req, res) => {
  res.render('paciente_Inter')
});

// Farmacia
router.get('/almacen',(req, res) => {
  res.render('almacen')
});

router.get('/medicamentos',(req, res) => {
  res.render('medicamentos')
});

router.get('/grupoAsig',(req, res) => {
  res.render('grupoAsig')
});

router.get('/proveedores',(req, res) => {
  res.render('proveedores')
});

router.get('/distribucion',(req, res) => {
  res.render('distribucion')
});

router.get('/stock',(req, res) => {
  res.render('stock')
});

router.get('/pedidos',(req, res) => {
  res.render('pedidos')
});

router.get('/inventariosFar',(req, res) => {
  res.render('inventariosFar')
});

router.get('/solicitudes',(req, res) => {
  res.render('solicitudes')
});

module.exports = router;