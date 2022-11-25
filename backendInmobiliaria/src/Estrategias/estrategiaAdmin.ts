import {AuthenticationStrategy} from "@loopback/authentication";
import { Request, RedirectRoute, HttpErrors } from "@loopback/rest";
import { UserProfile } from "@loopback/security";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import parseBearerToken from "parse-bearer-token"; 
import { AutenticacionService } from "../services";
import { service } from "@loopback/core";

export class EstrategiaAdmin implements AuthenticationStrategy{
    //nombre de la estrategia
    name: string = "admin";

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
          //UserProfile: una asignacion para ejecutar los permisos
          let perfil:UserProfile = Object.assign({
            nombre:datos.data.nombre
          });
          return perfil;
        }else{
          throw new HttpErrors[401]("El Token no es valido")
        }  
      }else{
        throw new HttpErrors[401]("No hay un Token para esta solicitud")
      }
    }   
}