jest.mock('../../src/config/database', () => ({
  prisma: {
    task: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const { prisma } = require('../../src/config/database');
const taskService = require('../../src/services/task.service');
const AppError = require('../../src/utils/AppError');

describe('task.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createTask stores a task with normalized fields', async () => {
    prisma.task.create.mockResolvedValue({
      id: 'task-1',
      userId: 'user-1',
      title: 'Ship release',
      description: 'Deploy to production',
      category: 'Work',
      priority: 'HIGH',
      status: 'TODO'
    });

    const task = await taskService.createTask('user-1', {
      title: ' Ship release ',
      description: ' Deploy to production ',
      category: ' Work ',
      priority: 'high'
    });

    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        title: 'Ship release',
        description: 'Deploy to production',
        category: 'Work',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: null
      }
    });
    expect(task.id).toBe('task-1');
  });

  test('listTasks returns pagination metadata', async () => {
    prisma.task.count.mockResolvedValue(11);
    prisma.task.findMany.mockResolvedValue([{ id: 'task-1' }]);

    const result = await taskService.listTasks('user-1', { page: '2', limit: '5', search: 'deploy' });

    expect(prisma.task.count).toHaveBeenCalled();
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5
      })
    );
    expect(result.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 11,
      totalPages: 3
    });
  });

  test('getTaskById throws when task is missing', async () => {
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(taskService.getTaskById('user-1', 'task-1')).rejects.toBeInstanceOf(AppError);
  });
});
