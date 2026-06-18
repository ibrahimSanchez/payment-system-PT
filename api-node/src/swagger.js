module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Payment API',
    version: '1.0.0',
    description: 'API de gestión de usuarios, tarjetas y pagos',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  paths: {
    '/usuarios': {
      post: {
        summary: 'Crear usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
                required: ['nombre', 'email'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuario creado' },
          '400': { description: 'Datos inválidos' },
          '409': { description: 'Email ya registrado' },
        },
      },
      get: {
        summary: 'Listar usuarios',
        responses: {
          '200': { description: 'Lista de usuarios' },
        },
      },
    },
    '/usuarios/{id}': {
      get: {
        summary: 'Obtener usuario por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Usuario encontrado' },
          '404': { description: 'Usuario no encontrado' },
        },
      },
      patch: {
        summary: 'Actualizar usuario',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Usuario actualizado' },
          '400': { description: 'Datos inválidos' },
          '404': { description: 'Usuario no encontrado' },
          '409': { description: 'Email ya registrado' },
        },
      },
      delete: {
        summary: 'Eliminar usuario',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Usuario eliminado' },
          '404': { description: 'Usuario no encontrado' },
        },
      },
    },
    '/usuarios/{id}/tarjetas': {
      post: {
        summary: 'Crear tarjeta para usuario',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  numero_tarjeta: { type: 'string' },
                  fecha_vencimiento: { type: 'string' },
                  tipo: { type: 'string', enum: ['credito', 'debito'] },
                },
                required: ['numero_tarjeta', 'fecha_vencimiento'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Tarjeta creada' },
          '400': { description: 'Datos inválidos' },
          '404': { description: 'Usuario no encontrado' },
          '409': { description: 'El número de tarjeta ya existe' },
        },
      },
      get: {
        summary: 'Listar tarjetas de usuario',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Lista de tarjetas' },
          '404': { description: 'Usuario no encontrado' },
        },
      },
    },
    '/usuarios/{id}/tarjetas/{tarjeta_id}': {
      get: {
        summary: 'Obtener tarjeta por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'tarjeta_id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Tarjeta encontrada' },
          '404': { description: 'Tarjeta no encontrada' },
        },
      },
      patch: {
        summary: 'Actualizar tarjeta',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'tarjeta_id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  numero_tarjeta: { type: 'string' },
                  fecha_vencimiento: { type: 'string' },
                  tipo: { type: 'string', enum: ['credito', 'debito'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Tarjeta actualizada' },
          '400': { description: 'Datos inválidos' },
          '404': { description: 'Tarjeta no encontrada' },
          '409': { description: 'El número de tarjeta ya existe' },
        },
      },
    },
    '/pagos': {
      post: {
        summary: 'Crear pago',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  usuario_id: { type: 'integer' },
                  tarjeta_id: { type: 'integer' },
                  monto: { type: 'number' },
                  descripcion: { type: 'string' },
                },
                required: ['usuario_id', 'tarjeta_id', 'monto'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Pago procesado' },
          '400': { description: 'Datos inválidos' },
          '404': { description: 'Usuario o tarjeta no encontrada' },
        },
      },
    },
    // '/pagos/{id}': {
    //   patch: {
    //     summary: 'Actualizar pago',
    //     parameters: [
    //       {
    //         name: 'id',
    //         in: 'path',
    //         required: true,
    //         schema: { type: 'integer' },
    //       },
    //     ],
    //     requestBody: {
    //       required: true,
    //       content: {
    //         'application/json': {
    //           schema: {
    //             type: 'object',
    //             properties: {
    //               descripcion: { type: 'string' },
    //               estado: { type: 'string', enum: ['pendiente', 'aprobado', 'rechazado'] },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     responses: {
    //       '200': { description: 'Pago actualizado' },
    //       '400': { description: 'Datos inválidos' },
    //       '404': { description: 'Pago no encontrado' },
    //     },
    //   },
    // },
    '/usuarios/{id}/pagos': {
      get: {
        summary: 'Listar pagos de un usuario',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Lista de pagos del usuario' },
          '404': { description: 'Usuario no encontrado' },
        },
      },
    },
  },
};
