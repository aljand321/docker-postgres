const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

var url = "http://localhost:3500/api";

router.get('/volver', (req,res) => {
    oneGrupoAsig = null
    res.redirect('/medicamento/dataGrupoA'); 
})

router.get('/volver2', (req,res) => {
    res.redirect('/medicamento/dataGrupoA'); 
})
router.get('/volver3/:id', (req,res) => {
    const { id } = req.params
    res.redirect('/medicamento/medFecha_cantidad/'+id); 
})
var dataGRUPOa;
router.get('/dataGrupoA',(req,res) =>{
    fetch('http://localhost:3500/api/asignacion')   
        .then(resp => resp.json())
        .then(resp =>{
            if(resp == ""){
                res.send("no hay datos en grupo designacion, añadir grupo designacion")
            }else{
                dataGRUPOa = resp;
                res.redirect('/medicamento/medicamentos');
            }
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })
});

//serv para renderisar la vista medicamento con datos de la tabla grupo asignacion
router.get('/volver15', (req,res) => {
    OnlyMedicamento = null;
    res.redirect('/medicamento/medicamentos');
})

router.get('/medicamentos',(req, res) => {
    fetch('http://localhost:3500/api/medicamento')   
        .then(resp => resp.json())
        .then(resp =>{
            if(dataGRUPOa == null){
                res.render('Almacen/medicamentos',{dataGRUPOa,resp})
            }else{
                res.render('Almacen/medicamentos',{
                    dataGRUPOa,
                    resp,
                    OnlyMedicamento,
                    msg_post_false, 
                    msg_post_true
                })  
            }
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })
  });

router.get('/msg', (req,res) => {
    res.send({
        msg_post_false,
        msg_post_true
    })
})

//servcio para añadir a la tabla medicamentos
var msg_post_false, msg_post_true;
router.post('/medicamentos', (req,res) =>{
    var data = req.body
    var esto = {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-type' : "application/json"
      }
  };
  fetch('http://localhost:3500/api/medicamento',esto)
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(data => {
     
    if(data.success == false){
        msg_post_false = data.msg
        res.redirect('/medicamento/dataGrupoA');
        msg_post_true = null
    }else{
        msg_post_true = data.message
        res.redirect('/medicamento/dataGrupoA');
        msg_post_false = null
        console.log(msg_post_true, "  esto es el mesaje del post")
    }
    
  })
});

//serv para mostrar un solo medicamento
let OnlyMedicamento
router.get('/OnlyMedicamento/:id',(req, res) =>{
    var id = req.params;
    fetch('http://localhost:3500/api/OnlyMedicamento/'+id.id)   
        .then(resp => resp.json())
        .then(resp =>{
            OnlyMedicamento = resp
            res.redirect('/medicamento/dataGrupoA')
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })
});

router.post('/updateMedicamento/:id', (req,res) =>{
    var id = req.params;
    var data = req.body;
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch(url+'/updateMedicamento/'+id.id,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => { 
      res.redirect('/medicamento/OnlyMedicamento/'+id.id);
    })

});

/*
<<<<<<<<<<<<<<<<>>>>>>>>>>>><<<<<>><<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<>>>>>>>><<<<<<<<<<<<<<<<<<<<<<
                Stock
<<<<<<<<<<<>>>>>>>>>>>>>>><<<<>><<<>>><<<><<<>><<<
<<<<<<<<<>>><<>>>>>>>>>>>>>>>>>>>>>>>><>>>>>>>>>><
*/

router.get('/stock', (req,res) => {
    fetch('http://localhost:3500/api/medicamento')   
        .then(resp => resp.json())
        .then(resp =>{         
            res.render('Almacen/stock_almacen',{
                resp
            })              
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })
})


//rutas para cantida y fecha de medicamentos

router.get('/medFecha_cantidad/:id_medicamento', (req,res) => {
    const { id_medicamento } = req.params
    fetch('http://localhost:3500/api/listMedicamentos/'+id_medicamento)   
        .then(resp => resp.json())
        .then(resp =>{         
            res.render('Almacen/med_fecha_cantidad',{
                resp
            })           
    })
    .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
    })
   
})

module.exports = router;