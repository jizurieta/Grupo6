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
  Inmueble,
  Arriendo,
} from '../models';
import {InmuebleRepository} from '../repositories';

export class InmuebleArriendoController {
  constructor(
    @repository(InmuebleRepository) protected inmuebleRepository: InmuebleRepository,
  ) { }

  @get('/inmuebles/{id}/arriendos', {
    responses: {
      '200': {
        description: 'Array of Inmueble has many Arriendo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Arriendo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Arriendo>,
  ): Promise<Arriendo[]> {
    return this.inmuebleRepository.arriendos(id).find(filter);
  }

  @post('/inmuebles/{id}/arriendos', {
    responses: {
      '200': {
        description: 'Inmueble model instance',
        content: {'application/json': {schema: getModelSchemaRef(Arriendo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Inmueble.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Arriendo, {
            title: 'NewArriendoInInmueble',
            exclude: ['id'],
            optional: ['inmuebleId']
          }),
        },
      },
    }) arriendo: Omit<Arriendo, 'id'>,
  ): Promise<Arriendo> {
    return this.inmuebleRepository.arriendos(id).create(arriendo);
  }

  @patch('/inmuebles/{id}/arriendos', {
    responses: {
      '200': {
        description: 'Inmueble.Arriendo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Arriendo, {partial: true}),
        },
      },
    })
    arriendo: Partial<Arriendo>,
    @param.query.object('where', getWhereSchemaFor(Arriendo)) where?: Where<Arriendo>,
  ): Promise<Count> {
    return this.inmuebleRepository.arriendos(id).patch(arriendo, where);
  }

  @del('/inmuebles/{id}/arriendos', {
    responses: {
      '200': {
        description: 'Inmueble.Arriendo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Arriendo)) where?: Where<Arriendo>,
  ): Promise<Count> {
    return this.inmuebleRepository.arriendos(id).delete(where);
  }
}
