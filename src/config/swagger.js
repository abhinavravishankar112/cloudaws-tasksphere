const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Cloud-Native TaskSphere API',
    version: '1.0.0',
    description: 'Production-ready TaskSphere API with JWT authentication, Prisma, and PostgreSQL.'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Version 1 API'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          data: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'clx123abc' },
                  name: { type: 'string', example: 'Ada Lovelace' },
                  email: { type: 'string', example: 'ada@example.com' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              },
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
          }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clx456def' },
          title: { type: 'string', example: 'Ship release' },
          description: { type: 'string', example: 'Deploy the production build' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'] },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          category: { type: 'string', example: 'Work', nullable: true },
          userId: { type: 'string', example: 'clx123abc' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API liveness',
        responses: {
          200: {
            description: 'Service is alive'
          }
        }
      }
    },
    '/health/ready': {
      get: {
        tags: ['Health'],
        summary: 'Check API readiness',
        responses: {
          200: {
            description: 'Service is ready'
          },
          503: {
            description: 'Database is not ready',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Ada Lovelace' },
                  email: { type: 'string', format: 'email', example: 'ada@example.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate an existing user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'ada@example.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          }
        }
      }
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List tasks with filtering, sorting, and pagination',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Task list returned successfully'
          }
        }
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Ship release' },
                  description: { type: 'string', example: 'Deploy to production' },
                  priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], example: 'HIGH' },
                  status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'], example: 'TODO' },
                  category: { type: 'string', example: 'Work' },
                  dueDate: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Task created successfully'
          }
        }
      }
    },
    '/tasks/{taskId}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get a single task by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Task returned successfully'
          }
        }
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Update a task',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Task updated successfully'
          }
        }
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          204: {
            description: 'Task deleted successfully'
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
