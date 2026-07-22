const { body, param, query } = require('express-validator');

const taskPriorityValues = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const taskStatusValues = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

const createTaskValidators = [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 200 }).withMessage('Task title must be 200 characters or less'),
  body('description').optional({ nullable: true }).isLength({ max: 2000 }).withMessage('Task description must be 2000 characters or less'),
  body('category').optional({ nullable: true }).trim().isLength({ max: 50 }).withMessage('Category must be 50 characters or less'),
  body('priority').optional().isIn(taskPriorityValues).withMessage('Priority must be one of LOW, MEDIUM, HIGH, URGENT'),
  body('status').optional().isIn(taskStatusValues).withMessage('Status must be one of TODO, IN_PROGRESS, BLOCKED, DONE'),
  body('dueDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Due date must be a valid ISO 8601 date')
];

const updateTaskValidators = [
  param('taskId').trim().notEmpty().withMessage('Task id is required'),
  body().custom((_, { req }) => {
    const allowedFields = ['title', 'description', 'priority', 'status', 'dueDate', 'category'];
    return allowedFields.some((field) => req.body[field] !== undefined);
  }).withMessage('At least one task field must be provided'),
  body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty').isLength({ max: 200 }).withMessage('Task title must be 200 characters or less'),
  body('description').optional({ nullable: true }).isLength({ max: 2000 }).withMessage('Task description must be 2000 characters or less'),
  body('category').optional({ nullable: true }).trim().isLength({ max: 50 }).withMessage('Category must be 50 characters or less'),
  body('priority').optional().isIn(taskPriorityValues).withMessage('Priority must be one of LOW, MEDIUM, HIGH, URGENT'),
  body('status').optional().isIn(taskStatusValues).withMessage('Status must be one of TODO, IN_PROGRESS, BLOCKED, DONE'),
  body('dueDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Due date must be a valid ISO 8601 date')
];

const taskIdValidators = [
  param('taskId').trim().notEmpty().withMessage('Task id is required')
];

const listTaskQueryValidators = [
  query('search').optional().trim().isLength({ max: 200 }).withMessage('Search term must be 200 characters or less'),
  query('status').optional().isIn(taskStatusValues).withMessage('Status must be one of TODO, IN_PROGRESS, BLOCKED, DONE'),
  query('priority').optional().isIn(taskPriorityValues).withMessage('Priority must be one of LOW, MEDIUM, HIGH, URGENT'),
  query('category').optional().trim().isLength({ max: 50 }).withMessage('Category filter must be 50 characters or less'),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'title', 'category']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
  query('dueDateFrom').optional().isISO8601().withMessage('dueDateFrom must be a valid ISO 8601 date'),
  query('dueDateTo').optional().isISO8601().withMessage('dueDateTo must be a valid ISO 8601 date')
];

module.exports = {
  createTaskValidators,
  updateTaskValidators,
  taskIdValidators,
  listTaskQueryValidators
};
