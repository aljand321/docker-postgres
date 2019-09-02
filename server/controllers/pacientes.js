import model from '../models';

const { Pacientes } = model;

  class Paciente {
    static registroPaciente(req, res) {
      const {   numeroHistorial,nombre,apellidop,apellidom, ci, fechanacimiento, 
        sexo, estadocivil, direccion, zona, telef, ocupacion, idiomas, lugranacimiento, 
        departameto, provincia, municipio,id_user} = req.body
        return Pacientes
          .create({
            numeroHistorial,
            nombre,
            apellidop,
            apellidom,
            ci,
            fechanacimiento,
            sexo,
            estadocivil,
            direccion,
            zona,
            telef,
            ocupacion,
            idiomas,
            lugranacimiento,
            departameto,
            provincia,
            municipio,
            id_user
           })
           .then(pacienteData => res.status(201).send({
              success: true,
              message: 'Paciente creado',
              pacienteData
            }))
       }
  static getPaciente(req, res) {
       return Pacientes
    .findAll()
    .then(Pacientes => res.status(200).send(Pacientes));
  }
//Only paciente
  static OnlyPaciente(req, res){
    var id = req.params.id;  
    Pacientes.findAll({
      where: {numeroHistorial : id}
        //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        });  
  }

  static paciente_id(req, res){
    var id = req.params.id;  
    Pacientes.findAll({
      where: {id : id}
        //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        });  
  }
}
        
export default Paciente;