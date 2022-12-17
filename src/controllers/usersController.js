const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { validationResult } = require('express-validator')

const usersController = {

    login: function(req, res) {
        // Validar la información del usuario
        let errors = validationResult(req);
    
        // Si hay errores, renderizar la vista de login con los errores
        if (!errors.isEmpty()) {
            return res.render('/users/login', {errors: errors.errors});
        }
    
        // Si no hay errores, verificar si el usuario está registrado en el archivo de usuarios
        let archivoUsuarios = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/users.json')));
        let usuarioRegistrado = false;
        for (let i = 0; i < archivoUsuarios.length; i++) {
            if (req.body !== undefined && req.body.email !== undefined && archivoUsuarios[i].email == req.body.email && bcrypt.compareSync(req.body.password, archivoUsuarios[i].password)) {

                usuarioRegistrado = true;
                break;
            }
        }
    
        // Si el usuario está registrado, redirigir al usuario a la página principal o a otra página de la aplicación
        if (usuarioRegistrado) {
            // Redirigir al usuario a la página principal o a otra página de la aplicación
            res.redirect('/');
        } else {
            // Si el usuario no está registrado, renderizar la vista de login con un mensaje de error
            res.render('users/login', {error: 'Usuario o contraseña no válidos'});
        }
    },
    register: function(req, res){
        return  res.render('/users/register');
      },
    

create: function (req, res) {
    let errors = validationResult(req);

    if (errors.isEmpty()){
    const user = {
        nombre: req.body.first_name,
        apellido: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    };



} else { 
    return res.render('login', {errors: errors.errors});
}

},
ingresar: (req,res) =>{
    
    const errors = validationResult(req);
    //return res.send(errors.mapped());
    if(errors.isEmpty()){
      let archivoUsuarios =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/users.json')));
      let usuarioLogueado = archivoUsuarios.find(usuario => usuario.email == req.body.email)
      //return res.send(usuarioLogueado);
      //Como podemos modificar nuestros req.body
      delete usuarioLogueado.password;
      req.session.usuario = usuarioLogueado;  //Guardar del lado del servidor
      //Aquí voy a guardar las cookies del usuario que se loguea
      if(req.body.recordarme){
        res.cookie('email',usuarioLogueado.email,{maxAge: 1000 * 60 * 60 * 24})
      }
      return res.redirect('/');   //Aquí ustedes mandan al usuario para donde quieran (Perfil- home - a donde deseen)

    }else{
      //Devolver a la vista los errores
      res.render(path.resolve(__dirname, '../views/users/login'),{errors:errors.mapped(),old:req.body});        
    }
  },
}

module.exports = usersController;