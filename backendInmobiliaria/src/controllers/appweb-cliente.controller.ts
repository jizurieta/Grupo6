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
  Appweb,
  Cliente,
} from '../models';
import {AppwebRepository} from '../repositories';

export class AppwebClienteController {
  constructor(
    @repository(AppwebRepository) protected appwebRepository: AppwebRepository,
  ) { }

  @get('/appwebs/{id}/clientes', {
    responses: {
      '200': {
        description: 'Array of Appweb has many Cliente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cliente)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Cliente>,
  ): Promise<Cliente[]> {
    return this.appwebRepository.clientes(id).find(filter);
  }

  @post('/appwebs/{id}/clientes', {
    responses: {
      '200': {
        description: 'Appweb model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Appweb.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewClienteInAppweb',
            exclude: ['id'],
            optional: ['appwebId']
          }),
        },
      },
    }) cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {
    return this.appwebRepository.clientes(id).create(cliente);
  }

  @patch('/appwebs/{id}/clientes', {
    responses: {
      '200': {
        description: 'Appweb.Cliente PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Partial<Cliente>,
    @param.query.object('where', getWhereSchemaFor(Cliente)) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.appwebRepository.clientes(id).patch(cliente, where);
  }

  @del('/appwebs/{id}/clientes', {
    responses: {
      '200': {
        description: 'Appweb.Cliente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Cliente)) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.appwebRepository.clientes(id).delete(where);
  }
}
