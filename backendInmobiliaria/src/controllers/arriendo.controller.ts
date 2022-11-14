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
import {Arriendo} from '../models';
import {ArriendoRepository} from '../repositories';

export class ArriendoController {
  constructor(
    @repository(ArriendoRepository)
    public arriendoRepository : ArriendoRepository,
  ) {}

  @post('/arriendos')
  @response(200, {
    description: 'Arriendo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Arriendo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Arriendo, {
            title: 'NewArriendo',
            exclude: ['id'],
          }),
        },
      },
    })
    arriendo: Omit<Arriendo, 'id'>,
  ): Promise<Arriendo> {
    return this.arriendoRepository.create(arriendo);
  }

  @get('/arriendos/count')
  @response(200, {
    description: 'Arriendo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Arriendo) where?: Where<Arriendo>,
  ): Promise<Count> {
    return this.arriendoRepository.count(where);
  }

  @get('/arriendos')
  @response(200, {
    description: 'Array of Arriendo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Arriendo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Arriendo) filter?: Filter<Arriendo>,
  ): Promise<Arriendo[]> {
    return this.arriendoRepository.find(filter);
  }

  @patch('/arriendos')
  @response(200, {
    description: 'Arriendo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Arriendo, {partial: true}),
        },
      },
    })
    arriendo: Arriendo,
    @param.where(Arriendo) where?: Where<Arriendo>,
  ): Promise<Count> {
    return this.arriendoRepository.updateAll(arriendo, where);
  }

  @get('/arriendos/{id}')
  @response(200, {
    description: 'Arriendo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Arriendo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Arriendo, {exclude: 'where'}) filter?: FilterExcludingWhere<Arriendo>
  ): Promise<Arriendo> {
    return this.arriendoRepository.findById(id, filter);
  }

  @patch('/arriendos/{id}')
  @response(204, {
    description: 'Arriendo PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Arriendo, {partial: true}),
        },
      },
    })
    arriendo: Arriendo,
  ): Promise<void> {
    await this.arriendoRepository.updateById(id, arriendo);
  }

  @put('/arriendos/{id}')
  @response(204, {
    description: 'Arriendo PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() arriendo: Arriendo,
  ): Promise<void> {
    await this.arriendoRepository.replaceById(id, arriendo);
  }

  @del('/arriendos/{id}')
  @response(204, {
    description: 'Arriendo DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.arriendoRepository.deleteById(id);
  }
}
