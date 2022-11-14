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
  Asesor,
} from '../models';
import {AppwebRepository} from '../repositories';

export class AppwebAsesorController {
  constructor(
    @repository(AppwebRepository) protected appwebRepository: AppwebRepository,
  ) { }

  @get('/appwebs/{id}/asesors', {
    responses: {
      '200': {
        description: 'Array of Appweb has many Asesor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Asesor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Asesor>,
  ): Promise<Asesor[]> {
    return this.appwebRepository.asesores(id).find(filter);
  }

  @post('/appwebs/{id}/asesors', {
    responses: {
      '200': {
        description: 'Appweb model instance',
        content: {'application/json': {schema: getModelSchemaRef(Asesor)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Appweb.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {
            title: 'NewAsesorInAppweb',
            exclude: ['id'],
            optional: ['appwebId']
          }),
        },
      },
    }) asesor: Omit<Asesor, 'id'>,
  ): Promise<Asesor> {
    return this.appwebRepository.asesores(id).create(asesor);
  }

  @patch('/appwebs/{id}/asesors', {
    responses: {
      '200': {
        description: 'Appweb.Asesor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {partial: true}),
        },
      },
    })
    asesor: Partial<Asesor>,
    @param.query.object('where', getWhereSchemaFor(Asesor)) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.appwebRepository.asesores(id).patch(asesor, where);
  }

  @del('/appwebs/{id}/asesors', {
    responses: {
      '200': {
        description: 'Appweb.Asesor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Asesor)) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.appwebRepository.asesores(id).delete(where);
  }
}
