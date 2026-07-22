const express = require('express');
const taskController = require('../controllers/task.controller');
const validateRequest = require('../middleware/validation.middleware');
const {
  createTaskValidators,
  listTaskQueryValidators,
  taskIdValidators,
  updateTaskValidators
} = require('../validators/task.validators');

const router = express.Router();

router.route('/').get(listTaskQueryValidators, validateRequest, taskController.listTasks).post(createTaskValidators, validateRequest, taskController.createTask);
router
  .route('/:taskId')
  .get(taskIdValidators, validateRequest, taskController.getTask)
  .patch(updateTaskValidators, validateRequest, taskController.updateTask)
  .delete(taskIdValidators, validateRequest, taskController.deleteTask);

module.exports = router;
