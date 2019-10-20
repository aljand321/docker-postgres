const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const datas = require('./url/export');

router.post('/enviar', (req,res) => {
  var data = req.body
  if (data != "" ){
    tok(data.data_token,data.data_token.user.id)
    datas.name.token = listItems
    res.status(200).json({
      success:true
    })
    
  }else{
    res.status(400).json({
      success:false,
    })
  }
})

// esta funcion es para poder mandar el usuario gegistrado de cada usuario
var listItems = {}
function tok(token,id){
  let storedItem = listItems[id];
    if (!storedItem) {
      storedItem = listItems[id] = {
        data: token,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array () {
  let arr = [];
  for (const id in listItems) {
      arr.push(listItems[id]);
  }
  return arr;
}

function remove_Token(id) {
  delete datas.name.token[id];
}


//funcion para saver si se estaentrando por login 
var login = {}
function sessions(token,id){
  let storedItem = login[id];
    if (!storedItem) {
      storedItem = login[id] = {
        data: token,
        qty: 0
      };
    }
    storedItem.qty++;
}

function array_session () {
  let arr = [];
  for (const id in login) {
      arr.push(login[id]);
  }
  return arr;
}

function remove_session(id) {
  delete datas.name.session[id];
}



router.get('/',(req, res) => {
  res.render('index', { msg1, msg2, msg3 })
});

router.get('/index2', (req,res) => {
  res.render('index2');
});
/**home aquiiiiiiiiiiiii */

router.get('/home',(req, res) => {
  
  fetch('http://localhost:3600/api/allUser')        
  .then(resp => resp.json())
  .then(data =>{  
    var lo = data.length
    fetch('http://localhost:3600/api/Only_Medicos')        
      .then(resp => resp.json())
      .then(medi =>{
        fetch('http://localhost:3600/api/OnlyPersonal')
        .then(resp => resp.json())
        .then(personal =>{
          fetch('http://localhost:3600/api/OnlyEnfermera')
          .then(resp => resp.json())
          .then(enfe =>{
            fetch('http://localhost:3600/api/OnlyFarma')
            .then(resp => resp.json())
            .then( fer =>{
              fetch('http://localhost:4600/api/liscuaderno')
              .then(resp => resp.json())
              .then(cua =>{
                fetch('http://localhost:4600/api/especialidad')
                .then(resp => resp.json())
                .then(esp =>{
                  fetch('http://localhost:3000/api/pacientes')
                  .then(resp => resp.json())
                  .then(paci =>{
                    res.render('home',{
                      lo,
                      medi,
                      data,
                      fer,
                      personal,
                      enfe,
                      cua,
                      esp,
                      paci,
                      log5:esp.length,
                      log4:cua.length,
                      lar: medi.length,
                      long: personal.length,
                      long1:enfe.length,
                      log3: fer.length,
                      log6:paci.length
                    })
                  })
                  
                })
              })
            })
          })
        })
      })    
    }) 
  });

var msg1,msg2,msg3, token_part;
router.post('/login', (req,res)  => {
  const username = req.body.username;
  const password = req.body.password;  
 
  if(username =="" ){
    msg3 = null
    msg1='Introdusca por favor la cuenta.';
    res.redirect('/')
    
  }else if( password == "" ){
    msg3 = null
    msg2 = 'Introdusca password.'
    res.redirect('/')   

  }else {
    var data = req.body;
    var enviar = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type' : "application/json"
    }
  }
  fetch('http://localhost:3600/api/login',enviar)
  .then(resp => resp.json())
  .catch(error => console.error('Error',error))
  .then(resp => {
    
    if(resp.user == false){
      msg1=null;
      msg2=null;
      msg3 =" Usted no esta registrado "
      res.redirect('/')   
    }else if(resp.success == false){
      msg1=null;
      msg2=null;
      msg3 = " Contraceña Incorrecta "
      res.redirect('/')   
    }else if ( datas.name.token[resp.user.id] == null ){
      token_part = resp.token.split(" ")[1].split(".")[2] // esto saca la parte final del token      
      tok(resp,resp.user.id); //funcion para añadir token del usuario  

      var session = {
        login:true
      }
      sessions(session,resp.user.id)
      datas.name.session = login // esto es para ver si el usuario inicio session desde login

      datas.name.token = listItems // esto es para añadir tokens a datas
      fetch('http://localhost:3600/api/user/'+resp.user.id)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(resp => {
        if(resp.role[0] == null || resp.role[0] == ""){
          res.status(400).json({
            success:false,
            msg:"El paciente todavia no tiene un rol o no se creo la especilidad donde el paciente esta queriendo entrar"
          })
        }else{
          console.log(resp, "  <<<<<<<< esto es lo que quiero ver <<<<<<<<<<<<<<<<<<<")
          if(resp.role.length <=1){
            if(resp.role[0].name == "Almacen"){
              //res.send(resp.role[0].name)
              res.redirect('/almacen/home/'+resp.id)
            }else if(resp.role[0].name == "fichaje"){
              res.redirect('/paciente/home/'+resp.id + '/'+ token_part)
              //res.send(resp.role)
            }else if(resp.role[0].name == "medico"){
              res.redirect('/consulta_externa/home/'+resp.id + '/'+ token_part)
            }else if(resp.role[0].name == "emergencia"){
              res.redirect('/emergencia2.0/home/'+resp.id + '/'+ token_part)
            }else if(resp.role[0].name == "farmacia"){
              res.redirect('/farmacia/home/' + resp.id + '/' + token_part)            
            }else if(resp.role[0].name == "hospitalizacion"){
              res.redirect('/Internaciones/home/'+resp.id)
            }else{
              res.send(resp)
            }
          }else{
            res.redirect('/home')
          }
        }
        //res.redirect('/almacen/home/'+resp.user.id)
      }) 
    }else {

      var session = {
        login:true
      }
      remove_session(resp.user.id)
      sessions(session,resp.user.id)
      datas.name.session = login // esto es para ver si el usuario inicio session desde login


      token_part = resp.token.split(" ")[1].split(".")[2] // esto saca la parte final del token      
      remove_Token(resp.user.id)
      
      tok(resp,resp.user.id); //funcion para añadir token del usuario  
      
      datas.name.token = listItems // esto es para añadir tokens a datas
      fetch('http://localhost:3600/api/user/'+resp.user.id)
      .then(resp => resp.json())
      .catch(error => console.error('Error',error))
      .then(resp => {
        if(resp.role[0] == null || resp.role[0] == ""){
          res.status(400).json({
            success:false,
            msg:"El paciente todavia no tiene un rol o no se creo la especilidad donde el paciente esta queriendo entrar"
          })
        }else{
          if(resp.role.length <=1){
            if(resp.role[0].name == "Almacen"){
              //res.send(resp.role[0].name)
              res.redirect('/almacen/home/'+resp.id)
            }else if(resp.role[0].name == "fichaje"){
              res.redirect('/paciente/home/'+resp.id + '/'+ token_part)
              //res.send(resp.role)
            }else if(resp.role[0].name == "medico"){
              res.redirect('/consulta_externa/home/'+resp.id + '/'+ token_part)
              console.log(resp, " entro y mostro esto")
            }else if(resp.role[0].name == "emergencia"){
              res.redirect('/emergencia2.0/home/'+resp.id + '/'+ token_part)            
            }else if(resp.role[0].name == "farmacia"){
              res.redirect('/farmacia/home/' + resp.id + '/' + token_part)
            }else if(resp.role[0].name == "hospitalizacion"){
              res.redirect('/Internaciones/home/'+resp.id)
            }else{
              res.send(resp)
            }
          }else{
            res.redirect('/home')
          }
        }
        //res.redirect('/almacen/home/'+resp.user.id)
      }) 
      
    }
    
  })
    .catch(error => {
      console.error('Error:', error)
        res.send("No hay coneccion con el servidor")
    }) 
  }
})


/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        login 2.0
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

router.get('/login2', (req,res) => {
  res.render('login2');
})

router.post('/login2', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;  
 
  if(username =="" ){
    msg3 = null
    msg1='Introdusca por favor la cuenta.';
    res.redirect('/')
    
  }else if( password == "" ){
    msg3 = null
    msg2 = 'Introdusca password.'
    res.redirect('/')   

  }else {
    var data = req.body;
    var enviar = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type' : "application/json"
      }
    }
    fetch('http://localhost:3600/api/login',enviar)
    .then(resp => resp.json())
    .catch(error => console.error('Error',error))
    .then(data_login => {
      if(data_login.success == true){
        if ( datas.name.token[data_login.user.id] == null ){
          tok(data_login,data_login.user.id);

          fetch('Internaciones/prueba',{id:45,nombre:"alejandro"})
          
        }else{
          remove_Token(resp.user.id)
          tok(data_login,data_login.user.id);
          res.redirect('/Internaciones/prueba',{id:45,nombre:alejandro})
        }
        
      }else{
        res.redirect('/')
      }

    })
  }
})

//ver token
router.get('/token', (req,res) => {
  res.send({
    token:datas.name.token,
    session: datas.name.session
  })
})

router.get('/forrm',(req, res) => {
  res.render('forrm')
});
router.get('/servicios',(req, res) => {
  res.render('servicios')
});
router.get('/usuarios',(req, res) => {
  res.render('usuarios')
});


router.get('/homec',(req, res) => {
  res.render('homec')
});
router.get('/citas_fichas2',(req, res) => {
  res.render('citas_fichas2')
});

 //vista de doctor
 
// Historiales Clinicos
router.get('/reportes_pacientes',(req, res) => {
  res.render('reportes_pacientes')
});

router.get('/vistaPrimPaciente',(req, res) => {
  res.render('vistaPrimPaciente')
});



// se movio esta ruta  a emergencia

//para las vistas de hospitaliacion
router.get('/homeHospitalizacion', (req,res) => {
  res.render('homeHospitalizacion')
});


//hospitalizacion 


router.get('/vistaHospitalizacion',(req, res) => {
  res.render('vistaHospitalizacion')
});


router.get('/Papeleta_Inter',(req, res) => {
  res.render('Papeleta_Inter')
});

// Internacion
router.get('/salas',(req, res) => {
  res.render('salas')
});
// role
router.get('/roles',(req, res) => {
  fetch('http://localhost:3600/api/personal')        
  .then(resp => resp.json())
  .then(data =>{  
    res.render('roles', {
      data
    })
  })
});
router.get('/creroles',(req, res) => {
  fetch('http://localhost:3600/api/roleall')        
  .then(resp => resp.json())
  .then(data =>{  
    res.render('CreRoles', {
      data
    })
  })
});
// role
router.get('/backup',(req, res) => {
  res.render('backup')
});

///paciente admin
router.get('/pacientead',(req, res) => {
  fetch('http://localhost:3500/api/medicamento')        
  .then(resp => resp.json())
  .then(data =>{  
    res.render('pacientead', {
      data
    })
  })
});
// Internacion salas 


//Se movio a routas salas

router.get('/paciente_Inter',(req, res) => {
  fetch('http://localhost:3000/api/pacientes')        
  .then(resp => resp.json())
  .then(data =>{  
    res.render('paciente_Inter', {
      data
    })
  })
 
});

router.get('/mostrar/:id_paciente', (req,res) => {
  const { id_paciente } = req.params
  fetch('http://localhost:3000/api/paciente_alergias/'+id_paciente  )        
  .then(resp => resp.json())
  .then(data =>{  
    res.send(data)
  })
})

// Farmacia
router.get('/almacen',(req, res) => {
  res.render('almacen')
});


//medicamento se movio a medicamento.js


// esta ruta se mando a almacen.js

// esta se movio a proveedores

// se movio a pedidos.js


router.get('/inventariosFar',(req, res) => {
  res.render('inventariosFar')
});

router.get('/solicitudes',(req, res) => {
  res.render('solicitudes')
});


//ruta temporal 
router.get('/consultaMed', (req, res) => {
  res.render('ConsultaMed');
});

//emergencia render
router.get('/emergencia', (req,res) => {
  res.render('emergencias/homeEmergencia')
});

//consulta externa

router.get('/datos_responsable', (req,res) => {
  res.render('datos_responsable')
});
router.get('/VerHistorial', (req,res) => {
  res.render('VerHistorial')
});
router.get('/ordenLaboratorio', (req,res) => {
  res.render('ordenLaboratorio')
});

router.get('/table_prueba', (req,res) => {
  res.render('hospitalizaciones/z_prueba_table')
})

module.exports = router;