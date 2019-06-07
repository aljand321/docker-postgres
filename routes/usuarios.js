const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/usuarios',(req, res) => {
    fetch('http://127.0.0.1:3500/personal/personal/')
        .then(resp => resp.json())
        .then(resp =>{
        res.render('usuarios',{resp});
     })
     .catch(error => {
      console.error('Error:', error)
      res.send("no hay coneccion con el servidor de usurios");
  })
});

  router.post('/usuarios', (req,res) => {
      var data = req.body;
      var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://127.0.0.1:3500/personal/personal/',esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        console.log(data.success);
        if (data.success == false){
            res.send(data)
        }else{
            res.redirect('/usuarios/usuarios');
        }
        
    })
  });
router.get('/usuarios/:id',(req, res) => {
  var id = req.params;
  fetch('http://127.0.0.1:3500/personal/OnlyPersonal/'+id.id)
      .then(resp => resp.json())
      .then(resp =>{
      res.render('usuarioUpdate',{
        resp
      });
   });
});

//servicio para actualizar personal
router.post('/updatePersonal/:id',(req,res) => {
  var id = req.params;
  var data = req.body;
  var enviar = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type' : "application/json"
    }
  }
  fetch('http://127.0.0.1:3500/personal/updatePersonal/'+id.id,enviar)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    res.redirect('/usuarios/usuarios')
  })
});


router.get('/UsuraioCuenta/:id', (req,res) => {
  var id = req.params
  fetch('http://127.0.0.1:3500/usuarios/mostrarCuentas/'+id.id)
        .then(resp => resp.json())
        .then(resp =>{
        res.render('usuarioCuenta',{
          id,
          resp
        });
     });
});

router.post('/crearCuenta/:id', (req,res) => {
  var id = req.params
  console.log(id, "    este es el id >>>>>>>>>>>>>>>>>>>>>>>>><" )
  var data = req.body
  var enviar = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type' : "application/json"
    }
  }
  fetch('http://127.0.0.1:3500/usuarios/userCuenta/'+id.id,enviar)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    res.redirect('/usuarios/UsuraioCuenta/'+id.id)
  })
});



module.exports = router;