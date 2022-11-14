import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Usuario,
  Propietario,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioPropietarioController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Propietario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Propietario)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Propietario>,
  ): Promise<Propietario[]> {
    return this.usuarioRepository.propietarios(id).find(filter);
  }

  @post('/usuarios/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Propietario)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Propietario, {
            title: 'NewPropietarioInUsuario',
            exclude: ['id'],
            optional: ['usuarioId']
          }),
        },
      },
    }) propietario: Omit<Propietario, 'id'>,
  ): Promise<Propietario> {
    return this.usuarioRepository.propietarios(id).create(propietario);
  }

  @patch('/usuarios/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Usuario.Propietario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Propietario, {partial: true}),
        },
      },
    })
    propietario: Partial<Propietario>,
    @param.query.object('where', getWhereSchemaFor(Propietario)) where?: Where<Propietario>,
  ): Promise<Count> {
    return this.usuarioRepository.propietarios(id).patch(propietario, where);
  }

  @del('/usuarios/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Usuario.Propietario DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Propietario)) where?: Where<Propietario>,
  ): Promise<Count> {
    return this.usuarioRepository.propietarios(id).delete(where);
  }
}
