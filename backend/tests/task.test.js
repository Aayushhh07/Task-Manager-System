const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

let token, userId, taskId;

describe('Task API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Task.deleteMany();
    const user = await User.create({ name: 'Task User', email: 'task@example.com', password: 'password123' });
    userId = user._id;
    const res = await request(app).post('/api/auth/login').send({ email: 'task@example.com', password: 'password123' });
    token = res.body.token;
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Task')
      .field('assignedTo', userId.toString());
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
    taskId = res.body._id;
  });
  it('should get tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('status', 'completed');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'completed');
  });
  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Task deleted');
  });
});
