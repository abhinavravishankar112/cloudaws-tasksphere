const { prisma } = require('../config/database');
const AppError = require('../utils/AppError');

const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const allowedStatuses = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
const allowedSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'title', 'category'];
const defaultSortField = 'createdAt';

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeEnumValue(value, allowedValues) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = String(value).toUpperCase();
  return allowedValues.includes(normalizedValue) ? normalizedValue : undefined;
}

function buildTaskWhere(userId, query) {
  const where = { userId };
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const status = normalizeEnumValue(query.status, allowedStatuses);
  const priority = normalizeEnumValue(query.priority, allowedPriorities);
  const dueDateFrom = query.dueDateFrom ? new Date(query.dueDateFrom) : undefined;
  const dueDateTo = query.dueDateTo ? new Date(query.dueDateTo) : undefined;
  const category = typeof query.category === 'string' ? query.category.trim() : '';

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (category) {
    where.category = { equals: category, mode: 'insensitive' };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (dueDateFrom || dueDateTo) {
    where.dueDate = {};

    if (dueDateFrom && !Number.isNaN(dueDateFrom.getTime())) {
      where.dueDate.gte = dueDateFrom;
    }

    if (dueDateTo && !Number.isNaN(dueDateTo.getTime())) {
      where.dueDate.lte = dueDateTo;
    }
  }

  return where;
}

function buildTaskOrder(query) {
  const sortField = allowedSortFields.includes(query.sortBy) ? query.sortBy : defaultSortField;
  const sortOrder = String(query.sortOrder || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

  return {
    [sortField]: sortOrder
  };
}

function buildPagination(query) {
  const page = toPositiveInteger(query.page, 1);
  const limit = Math.min(toPositiveInteger(query.limit, 10), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

async function createTask(userId, input) {
  if (!input.title || !input.title.trim()) {
    throw new AppError('Task title is required', 400);
  }

  const description = typeof input.description === 'string' ? input.description.trim() : null;
  const category = typeof input.category === 'string' ? input.category.trim() : null;

  const task = await prisma.task.create({
    data: {
      userId,
      title: input.title.trim(),
      description,
      category,
      priority: normalizeEnumValue(input.priority, allowedPriorities) || 'MEDIUM',
      status: normalizeEnumValue(input.status, allowedStatuses) || 'TODO',
      dueDate: input.dueDate ? new Date(input.dueDate) : null
    }
  });

  return task;
}

async function listTasks(userId, query) {
  const where = buildTaskWhere(userId, query);
  const orderBy = buildTaskOrder(query);
  const { page, limit, skip } = buildPagination(query);

  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      orderBy,
      skip,
      take: limit
    })
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  };
}

async function getTaskById(userId, taskId) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId
    }
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
}

async function updateTask(userId, taskId, input) {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId
    }
  });

  if (!existingTask) {
    throw new AppError('Task not found', 404);
  }

  const title = typeof input.title === 'string' ? input.title.trim() : undefined;
  const description = typeof input.description === 'string' ? input.description.trim() : input.description === null ? null : undefined;
  const category = typeof input.category === 'string' ? input.category.trim() : input.category === null ? null : undefined;
  const dueDate = input.dueDate === null ? null : input.dueDate ? new Date(input.dueDate) : undefined;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      category,
      priority: input.priority ? normalizeEnumValue(input.priority, allowedPriorities) : undefined,
      status: input.status ? normalizeEnumValue(input.status, allowedStatuses) : undefined,
      dueDate
    }
  });

  return task;
}

async function deleteTask(userId, taskId) {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId
    }
  });

  if (!existingTask) {
    throw new AppError('Task not found', 404);
  }

  await prisma.task.delete({ where: { id: taskId } });

  return null;
}

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask
};
