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
  Propietario,
} from '../models';
import {AppwebRepository} from '../repositories';

export class AppwebPropietarioController {
  constructor(
    @repository(AppwebRepository) protected appwebRepository: AppwebRepository,
  ) { }

  @get('/appwebs/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Array of Appweb has many Propietario',
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
    return this.appwebRepository.propietarios(id).find(filter);
  }

  @post('/appwebs/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Appweb model instance',
        content: {'application/json': {schema: getModelSchemaRef(Propietario)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Appweb.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Propietario, {
            title: 'NewPropietarioInAppweb',
            exclude: ['id'],
            optional: ['appwebId']
          }),
        },
      },
    }) propietario: Omit<Propietario, 'id'>,
  ): Promise<Propietario> {
    return this.appwebRepository.propietarios(id).create(propietario);
  }

  @patch('/appwebs/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Appweb.Propietario PATCH success count',
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
    return this.appwebRepository.propietarios(id).patch(propietario, where);
  }

  @del('/appwebs/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Appweb.Propietario DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Propietario)) where?: Where<Propietario>,
  ): Promise<Count> {
    return this.appwebRepository.propietarios(id).delete(where);
  }
}
