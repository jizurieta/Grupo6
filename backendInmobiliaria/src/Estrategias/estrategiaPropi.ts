//Para implementar la Estrategia del Configurador o cualquier otra, 
//simplemente copiamos la Estrategia del administrador y realizamos
//los sgtes cambios:
/**
 * 1) Modificar el nombre de la Clase:EstrategiaAdmin->EstrategiaPropi
 * 2) Modificar el nombre de la Estrategia: admin->propi
 *   */ 
import {AuthenticationStrategy} from "@loopback/authentication";
import { Request, RedirectRoute, HttpErrors } from "@loopback/rest";
import { UserProfile } from "@loopback/security";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import parseBearerToken from "parse-bearer-token"; 
import { AutenticacionService } from "../services";
import { service } from "@loopback/core";
//inicializamos una bandera
var respuesta:Boolean = false;

export class EstrategiaPropi implements AuthenticationStrategy{//Cambiamos nombre Clase
    //nombre de la estrategia
    name: string = "propi"; //Cambiamos el nombre

    constructor(
      @service(AutenticacionService)
      public servicioAutenticacion:AutenticacionService
    ){}
    //Apenas empizo a escribir "authenticate" realiza automaticamente la importacion
    //async authenticate(request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>):
    //: Promise<UserProfile | RedirectRoute | undefined>
    //Creamos una solicitud basica; sin el resto de parametros. No nos interesa redireccionar una ruta
    async authenticate(request: Request): Promise<UserProfile | undefined> {
      //Cuando el usuario realize la solicitud, validamos el token
      let token = parseBearerToken(request);
      if (token){
        //lo validamos
        let datos = this.servicioAutenticacion.validarToken(token);
        if (datos){
          //if (datos.data.rol[0].nombre == "administrador"){
            //UserProfile: una asignacion para ejecutar los permisos
          //  let perfil:UserProfile = Object.assign({
          //    nombre:datos.data.nombre
          //  });
          //  return perfil;
          //}else{
          //  throw new HttpErrors[401]("Ud No tiene permisos de acceso para este recurso")
          //}
          if (datos.data.rol){
             //REcorremos la lst rol[] que hay en el Obj DATA (data)
             //del token (datos)
             datos.data.rol.forEach(function(i:any) {
                if (i.nombre == "propietario"){
                  respuesta = true;
                }
             });
             if (respuesta){
                let perfil:UserProfile = Object.assign({
                   nombre:datos.data.nombre
                });
                return perfil;
             }else{
                throw new HttpErrors[401]("Ud no tiene permisos de Propietario");
             } 
          }else{
            throw new HttpErrors[401]("Ud No tiene permisos de acceso para este recurso");
          }  
        }else{
            throw new HttpErrors[401]("El Token no es valido");
        }
      }else{
        throw new HttpErrors[401]("No hay Token para la solicitud")
      }
    }   
}