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
} from '@loopback/rest';
import {Appweb} from '../models';
import {AppwebRepository} from '../repositories';

export class AppwebController {
  constructor(
    @repository(AppwebRepository)
    public appwebRepository : AppwebRepository,
  ) {}

  @post('/appwebs')
  @response(200, {
    description: 'Appweb model instance',
    content: {'application/json': {schema: getModelSchemaRef(Appweb)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appweb, {
            title: 'NewAppweb',
            exclude: ['id'],
          }),
        },
      },
    })
    appweb: Omit<Appweb, 'id'>,
  ): Promise<Appweb> {
    return this.appwebRepository.create(appweb);
  }

  @get('/appwebs/count')
  @response(200, {
    description: 'Appweb model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Appweb) where?: Where<Appweb>,
  ): Promise<Count> {
    return this.appwebRepository.count(where);
  }

  @get('/appwebs')
  @response(200, {
    description: 'Array of Appweb model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Appweb, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Appweb) filter?: Filter<Appweb>,
  ): Promise<Appweb[]> {
    return this.appwebRepository.find(filter);
  }

  @patch('/appwebs')
  @response(200, {
    description: 'Appweb PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appweb, {partial: true}),
        },
      },
    })
    appweb: Appweb,
    @param.where(Appweb) where?: Where<Appweb>,
  ): Promise<Count> {
    return this.appwebRepository.updateAll(appweb, where);
  }

  @get('/appwebs/{id}')
  @response(200, {
    description: 'Appweb model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Appweb, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Appweb, {exclude: 'where'}) filter?: FilterExcludingWhere<Appweb>
  ): Promise<Appweb> {
    return this.appwebRepository.findById(id, filter);
  }

  @patch('/appwebs/{id}')
  @response(204, {
    description: 'Appweb PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appweb, {partial: true}),
        },
      },
    })
    appweb: Appweb,
  ): Promise<void> {
    await this.appwebRepository.updateById(id, appweb);
  }

  @put('/appwebs/{id}')
  @response(204, {
    description: 'Appweb PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() appweb: Appweb,
  ): Promise<void> {
    await this.appwebRepository.replaceById(id, appweb);
  }

  @del('/appwebs/{id}')
  @response(204, {
    description: 'Appweb DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.appwebRepository.deleteById(id);
  }
}
