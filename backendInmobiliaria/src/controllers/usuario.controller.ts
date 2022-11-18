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
} from '@loopback/rest';
import { keys } from '../configuracion/keys';
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
//Hacemos uso del servicio de autenticacion
import {AutenticacionService} from '../services';
//A traves de una constante extraemos el paquete 
const fetch = require("node-fetch");

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    //inicializamos el servicio de autenticacion
    @service(AutenticacionService)
    public servicioAutenticacion : AutenticacionService
  ) {}
  //Cambianos la ruta /usuarios a /registro @post('/usuarios').
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
      //Inicia proceso de Notificacion al usuario (Sin usar el simulador POSTMAN) 
      let destino = usu.correo; 
      let asunto  = 'Registro en la APP INMOBILIARIA...';
      //Usamos un string templete para generar el mensaje
      let mensaje = `Hola, ${usu.usuario}, su nombre de usuario es: ${usu.correo} y su contraseña es: ${password}`; 
      //vamos a consumir la aplicacion (server.py) que esta en python, para ello debemos instalar el 
      //paquete [fetch]
      //[/e-mail] definida en el archivo server.py en python @app.route('/e-mail')
      //then significa que va a enviar la respuesta cuando ejecute este metodo.
      //fetch(`http://localhost:5000/e-mail?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`)
      //Ahora reemplazamos la ruta http://localhost:5000 por un apuntador al archivo [keys]
      fetch(`${keys.urlNotificaciones}/e-mail?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`)
      .then((data:any)=>{ //evalua cualquier tipo de dato que envie el servidor
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
  ):Promise<Usuario | null>{
      let claveCifrada = this.servicioAutenticacion.encriptarPassword(credenciales.password);
      //Generamos una variable que espera para cargarse hasta
      //recibir una respuesta de un elemento especifico(findOne)
      //donde el correo es igual al usuario
      let usuario = await this.usuarioRepository.findOne({
        where:{
          correo:credenciales.usuario,
          clave:claveCifrada
        }
      });
      return usuario;
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
          id:usu.id,
          nombre:usu.usuario 
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
