import { service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
  Request,
} from '@loopback/rest';
import { keys } from '../configuracion/keys';
import {CambioPassword, Credenciales, Usuario} from '../models';
import {AsesorRepository, ClienteRepository, PropietarioRepository, UsuarioRepository} from '../repositories';
//Hacemos uso del servicio de autenticacion
import {AutenticacionService} from '../services';
//A traves de una constante extraemos el paquete 
const fetch = require("node-fetch");

export class UsuarioController {
  constructor(
    //Inicializamos los repositorios de: usuario, propietario,
    //cliente y asesor
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    @repository(PropietarioRepository)
    public propietarioRepositorio: PropietarioRepository,
    @repository(ClienteRepository)
    public clienteRepositorio: ClienteRepository,
    @repository(AsesorRepository)
    public asesorRepositorio: AsesorRepository,
    //inicializamos el servicio de autenticacion
    @service(AutenticacionService)
    public servicioAutenticacion : AutenticacionService,
  ) {}
  //Cambianos la ruta @post('/usuarios') a @post('/registro').
  //La estrategia a seguir es: capturar el email del usuario y
  //a ese email le asignamos el password
  @post('/registro')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  //Modificar este metodo para asignar el password aleatoriamente
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
     //Pasamos el password cifrado a la BD.
      let password = this.servicioAutenticacion.generarPassword();
      let passwordEncriptado = this.servicioAutenticacion.encriptarPassword(password);
      usuario.clave = passwordEncriptado;
      //Espere hasta que almacene el obj usuario 
      let usu = await this.usuarioRepository.create(usuario);
      
      if (usuario.perfil == "Propietario"){
        let pro = await this.propietarioRepositorio.create(usuario);
      }else if(usuario.perfil == "Cliente"){
        let cli = await this.clienteRepositorio.create(usuario);
      }else if(usuario.perfil == "Asesor"){
        let ase = await this.asesorRepositorio.create(usuario);
      }else{
        throw new HttpErrors[401]("Perfil no existe!!!");
      }

      //Inicia proceso de NOTIFICACION al usuario (Sin usar el simulador POSTMAN) 
      let destino = usu.correo; 
      let asunto  = 'Registro en la APP INMOBILIARIA...';
      //Usamos un string templete (``) para generar el mensaje
      let mensaje = `Hola, ${usu.nombre}, su nombre de usuario es: ${usu.correo} y su contraseña es: ${password}`; 
      //vamos a consumir la aplicacion (server.py) que esta en python, para ello debemos instalar el 
      //paquete [fetch]
      //[/e-mail] definida en el archivo server.py en python @app.route('/e-mail')
      //then significa que va a enviar la respuesta cuando ejecute este metodo.
      //fetch(`http://127.0.0.1:5000/e-mail?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`)
      //Ahora reemplazamos la ruta http://localhost:5000 por un apuntador al archivo [keys]
      fetch(`${keys.urlNotificaciones}/e-mail?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`).then
        ((data:any)=>{ //evalua cualquier tipo de dato que envie el servidor
          console.log(data); //muestra los datos que envia el servidor a traves de la consola de la app.
        });
    return usu;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
  /**
   * Metodos Propios para la logica del negocio
   */
  //Metodo POST para el proceso de autenticacion
  //Cambianos la ruta /identificar-usuario a /login
  @post('/login',{
    //genera una respuesta
    responses:{
      '200':{
        description: "Identificacion del Usuario"
      }
    }
  })
  async identificar(
    //Desde el request obtengo unas credenciales de tipo
    //Credenciales
    @requestBody() credenciales:Credenciales
    //Promete devolver un objeto de tipo Usuario o un
    //Obj nulo
  ){ //:Promise<Usuario | null>{
      let claveCifrada = this.servicioAutenticacion.encriptarPassword(credenciales.password);
      //Generamos una variable que espera para cargarse hasta
      //recibir una respuesta de un elemento especifico(findOne)
      //donde el correo es igual al usuario
      //let usuario = await this.usuarioRepository.findOne({
      //  where:{
      //    correo:credenciales.usuario,
      //    clave:claveCifrada//clave:credenciales.password
      //  }
      //});

      let usu = await this.servicioAutenticacion.identificarUsuario(credenciales);
      if (usu){
        let token = this.servicioAutenticacion.generarToken(usu) 
        return{
          info:{
            nombre:usu.nombre,
            correo:usu.correo
          },
          tk:token
        }
      }else{
        throw new HttpErrors[401]("Datos no validos!!!") 
      } 
      //return usu;
  }

  @post('/RecuperarPassword')
  @response(200, {
    description:"Recuperacion de contraseña"
  })
  async recuperar(
    //El usuario envia una solicitud y capturamos la solicitud a traves del Body
    //de la pagina; el usuario envia el email  
    @requestBody() email : string
  ):Promise<Boolean>{
    let usu = await this.usuarioRepository.findOne({
       where:{
        //Donde el correo coincida con el email
        correo:email
       } 
    });
    if (usu){
      //Generar contraseña
      let clave = this.servicioAutenticacion.generarPassword();
      let claveCifrada = this.servicioAutenticacion.encriptarPassword(clave);
      usu.clave = claveCifrada;
      //me conecto a la BD por el metodo await
      await this.usuarioRepository.updateById(usu.id, usu);
      /*Notificacion de cambio de contarseña al usuario*/
      let destino = usu.correo;
      let asunto  = "Recuperacion de password desde la App-Inmobilaria";
      let mensaje = `Hola, ${usu.nombre}, se realizo la recuperacion del password de ingreso a la App; su nuevo password es: ${clave}`;
      
      fetch(`${keys.urlNotificaciones}/e-mail?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`).then
      ((data:any)=>{ //evalua cualquier tipo de dato que envie el servidor
        console.log(data); //muestra los datos que envia el servidor a traves de la consola de la app.
      });
      console.log("Se ha enviado el nuevo password al usuario")
      return true;
    }else{
      console.log("El usuario no fue encontrado")
      return false;
    }
  }

  @post('/ModificarPassword')
  @response(200,{
    description:"Modificar contraseña de parte del usuario"
  })
  async modificar(
    @requestBody () datos: CambioPassword 
  ):Promise <Boolean>{
    let usu = await this.usuarioRepository.findOne({
      where:{
        clave: this.servicioAutenticacion.encriptarPassword(datos.passActual)
      }
    });
    if (usu){
      if (datos.passNuevo == datos.passValidado){
        usu.clave = this.servicioAutenticacion.encriptarPassword(datos.passNuevo);
        await this.usuarioRepository.updateById(usu.id, usu);
        /**Notificar al usuario el cambio de contraseña */
        let destino = usu.correo;
        let asunto  = "Cambio del password en la App-Inmobilaria";
        let mensaje = `Hola, ${usu.nombre}, ud ha realiza un cambio de password para ingreso a la App; su nuevo password es: ${datos.passNuevo}`;
        
        fetch(`${keys.urlNotificaciones}/e-mail?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`).then
        ((data:any)=>{ //evalua cualquier tipo de dato que envie el servidor
          console.log(data); //muestra los datos que envia el servidor a traves de la consola de la app.
        });
        console.log("El cambio de contraseña fue exitoso");
        return true;
      }else{
        console.log("Las contraseñas no coinciden")
        return false;
      } 
    }else{
      console.log("El usaurio no existe en la BD");
      return false;
    }
  }

  //Vamos a generar un logueo con Token
  @post('/LoginT')
  //Generamos una respuesta con Cod. 200
  @response(200,{
    //Descripcion de Cabezera
    descripcion:"Identificacion de usuarios con generacion de Token"
  })
  //Implementamos el metodo asincronico [IdentificarT]
  async identificarT(
    //Capturamos datos del Obj Credenciales
    @requestBody() credenciales:Credenciales
  ){
    credenciales.password = this.servicioAutenticacion.encriptarPassword(credenciales.password);
    //Vamos a trabajar sin Promesa; lo haremos con la var [usu]
    //El metodo {await} es el complemento del metodo {async}
    let usu = await this.servicioAutenticacion.identificarUsuario(credenciales);
    //Si el ususario existe
    if (usu){
      let token = this.servicioAutenticacion.generarToken(usu);
      return{
        datos:{
          //Al realizar la consulta desde el Postman lo retorna en formato JSON
          id:usu.id,
          nombre:usu.nombre 
        },
        //Este dato se muestra solo como prueba, no se debe mostrar al cliente
        tk:token
      }
    }else{
      //Si no existe lanza una excepcion
      //401: No se pudo realizar la validacion
      throw new HttpErrors[401]("Datos Invalidos!!!");
    }
  }
}  
