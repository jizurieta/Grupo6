import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { keys } from '../configuracion/keys';
import { Credenciales, Usuario } from '../models';
import { UsuarioRepository } from '../repositories';
//La var generador apunta al paquete(generate-password)
const generador = require("generate-password");
//La var cryptoJS apunta al paquete(crypto-js)
const cryptoJS  = require("crypto-js");
//La var tokenJWT apunta al paquete(jsonwebtoken)
const tokenJWT = require("jsonwebtoken");


@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    //Inicializamos el repositorio para tener acceso a el.
    @repository(UsuarioRepository)
    public repositorioUsuario: UsuarioRepository
  ) {}

  /*
   * Add service methods here
   */
  //genera password aleatorio de 8 caracteres de longitud
  generarPassword(){
    /*http://npm.io/package/generate-password*/
    let password = generador.generate({
      length:8,
      numbers: true
    });
    return password;
  }

  encriptarPassword(password:string){
    /*http://npmjs.com/package/crypto-js*/
    //Usamos el metodo de encriptacion MD5
    let passwordEncriptado = cryptoJS.MD5(password);
    return passwordEncriptado;  
  }

  //Tenemos el Obj [Credenciales] con atributos [usuario, contraseña] 
  identificarUsuario(credenciales:Credenciales){
    try {
      let usu = this.repositorioUsuario.findOne({
        where:{
          correo:credenciales.usuario,
          clave:credenciales.password
        }
      });
      //Si existe el usuario (var usu)
      if (usu){
        return usu;
      } 
      return false;
    } catch {
      return false;
    }
  }
  //Vamos a generar el Token, y para ello instalamos el paquete [jsonwebtoken]
  //http://jwt.io
  generarToken(usuario:Usuario){
    //Accesdemos al metodo de firma a traves de la Clase [tokenJWT]
    let token = tokenJWT.sign({
      //Enviamos los sgtes parametros:
      //1mer parametro, los atributos del Obj Usuario
      data:{
        //El id lo vamos a usar para acceder a la coleccion [Roles]
        id:usuario.id,
        //El correo lo vamos a usar para las Notificaciones
        correo:usuario.correo,
        nombre:usuario.usuario
      }
    },//2do parametro, la llave de encriptacion del dato
    keys.llaveJWT);

    return tokenJWT;
  }
  
  validarToken(token:string){
    try {
      //Si la validacion de los datos esta O.K, entonces retorna los mismos datos 
      let datos = tokenJWT.verify(token, keys.llaveJWT);
      return datos;
    } catch {
      //En caso que no los haya validado
      return false;
    }
  }
}

