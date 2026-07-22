const asyncHandler = require('../utils/asyncHandler');
const taskService = require('../services/task.service');

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task
  });
});

const listTasks = asyncHandler(async (req, res) => {
  const result = await taskService.listTasks(req.user.id, req.query);

  res.status(200).json({
    success: true,
    data: result
  });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user.id, req.params.taskId);

  res.status(200).json({
    success: true,
    data: task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user.id, req.params.taskId, req.body);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user.id, req.params.taskId);

  res.status(204).send();
});

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask
};
