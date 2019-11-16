const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');

router.get('/lab_consulta_externa/:id_consulta/:token_id/:token_p', (req,res) => {
    const { id_consulta, token_id, token_p} = req.params
    if(datas.name.token[token_id] && datas.name.token[token_id].data.token.split(" ")[1].split(".")[2] == token_p){
        fetch('http://localhost:3000/api/OnlyConsulta/'+id_consulta)        
        .then(resp => resp.json())
        .then(ConsultaOnly =>{
            console.log(ConsultaOnly, " <<<<<<<<<<<< esto es lo que quiero ver")
            fetch('http://localhost:3000/api/onlyPaciente/'+ConsultaOnly[0].numeroHistorial)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(data_paciente => {
                console.log(data_paciente, " <<<<<<<<<<<< esto es lo que quiero ver")
                res.render('consulta_externa/O_Laboratorio',{
                    ConsultaOnly,
                    data_doc:datas.name.data_user[token_id],
                    data_paciente
                })
             })
            
        })
        .catch(error => {
            res.status(500).json({
                success:false,
                msg:"No hay coneccion que el servidor 3000",
                error
            })
        })
    }else{
        res.redirect('/')
    }
})

router.post('/vue_insert_lab_consultaExterna/:id_consulta', (req,res) => {
    const { id_consulta } = req.params
    var data = req.body
    console.log(data, " z<<<")
    var esto = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Content-type' : "application/json"
        }
    };
    fetch('http://localhost:3050/api/create_lab_consulta/'+id_consulta,esto)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then( data => {
        res.status(200).json(data)
    })
})

//rutas para la lista de laboratorios
router.get('/list_ecografias/:historial', (req,res) => {
    const { historial } = req.params
    fetch('http://localhost:3050/api/list_ecografia/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_rayosX/:historial', (req,res) => {
    const { historial } = req.params
    fetch('http://localhost:3050/api/list_rayosX/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})
router.get('/list_laboratorios/:historial', (req,res) => {
    const { historial } = req.params
    fetch('http://localhost:3050/api/list_lab/'+historial)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})

router.get('/vue_one_lab/:id_lab', (req,res) => {
    const { id_lab } = req.params
    fetch('http://localhost:3050/api/one_lab/'+id_lab)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => {
        res.status(200).json(data)
    })
})


module.exports = router;

