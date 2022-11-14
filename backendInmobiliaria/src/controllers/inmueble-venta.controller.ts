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
  Venta,
} from '../models';
import {InmuebleRepository} from '../repositories';

export class InmuebleVentaController {
  constructor(
    @repository(InmuebleRepository) protected inmuebleRepository: InmuebleRepository,
  ) { }

  @get('/inmuebles/{id}/ventas', {
    responses: {
      '200': {
        description: 'Array of Inmueble has many Venta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Venta)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Venta>,
  ): Promise<Venta[]> {
    return this.inmuebleRepository.ventas(id).find(filter);
  }

  @post('/inmuebles/{id}/ventas', {
    responses: {
      '200': {
        description: 'Inmueble model instance',
        content: {'application/json': {schema: getModelSchemaRef(Venta)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Inmueble.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Venta, {
            title: 'NewVentaInInmueble',
            exclude: ['id'],
            optional: ['inmuebleId']
          }),
        },
      },
    }) venta: Omit<Venta, 'id'>,
  ): Promise<Venta> {
    return this.inmuebleRepository.ventas(id).create(venta);
  }

  @patch('/inmuebles/{id}/ventas', {
    responses: {
      '200': {
        description: 'Inmueble.Venta PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Venta, {partial: true}),
        },
      },
    })
    venta: Partial<Venta>,
    @param.query.object('where', getWhereSchemaFor(Venta)) where?: Where<Venta>,
  ): Promise<Count> {
    return this.inmuebleRepository.ventas(id).patch(venta, where);
  }

  @del('/inmuebles/{id}/ventas', {
    responses: {
      '200': {
        description: 'Inmueble.Venta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Venta)) where?: Where<Venta>,
  ): Promise<Count> {
    return this.inmuebleRepository.ventas(id).delete(where);
  }
}
