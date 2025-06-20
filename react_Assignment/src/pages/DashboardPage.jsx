import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksThunk, createTaskThunk, updateTaskThunk, deleteTaskThunk, fetchStatsThunk } from '../redux/taskSlice';
import { fetchUsersThunk } from '../redux/authSlice';
import Taskcard from '../components/Taskcard';
import TaskForm from '../components/TaskForm';
import Loader from '../components/Loader';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = [
  '#22c55e', // green
  '#facc15', // yellow
  '#3b82f6', // blue
  '#ef4444', // red
  '#a78bfa', // purple
  '#f472b6', // pink
  '#f97316', // orange
  '#64748b', // gray
];
const getColor = idx => STATUS_COLORS[idx % STATUS_COLORS.length];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, loading, error, stats } = useSelector((state) => state.tasks);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const users = useSelector((state) => state.auth.users);

  useEffect(() => {
    dispatch(fetchTasksThunk({ search, filter, sort }));
    dispatch(fetchStatsThunk());
    if (user?.role === 'admin') dispatch(fetchUsersThunk());
  }, [dispatch, user, search, filter, sort]);

  const handleCreate = (data) => {
    dispatch(createTaskThunk(data)).then(() => setShowForm(false));
  };
  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };
  const handleUpdate = (data) => {
    dispatch(updateTaskThunk({ id: editTask._id, data })).then(() => {
      setEditTask(null);
      setShowForm(false);
    });
  };
  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) dispatch(deleteTaskThunk(id));
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  // Dynamically compute status counts from tasks
  const statusCounts = {};
  tasks.forEach(task => {
    const status = task.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const pieData = Object.entries(statusCounts)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div>
      {user?.role === 'admin' && pieData.length > 0 && (
        <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
          <h3 className="text-center">Task Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={getColor(idx)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="text-gray-600">Welcome, {user?.name}!</div>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button onClick={() => { setEditTask(null); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ New Task</button>
        </div>
      </div>
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="bg-white p-4 rounded shadow flex-1">
          <div className="font-bold">Total</div>
          <div className="text-2xl">{stats.total}</div>
        </div>
        <div className="bg-green-100 p-4 rounded shadow flex-1">
          <div className="font-bold">Completed</div>
          <div className="text-2xl">{stats.completed}</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow flex-1">
          <div className="font-bold">ongoing</div>
          <div className="text-2xl">{stats.ongoing}</div>
        </div>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="px-2 py-1 border rounded" />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      {loading && <Loader />}
      {error && <div className="text-red-500">{error}</div>}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <TaskForm
            onSubmit={editTask ? handleUpdate : handleCreate}
            initialValues={editTask || { assignedTo: user._id }}
            users={users}
            isAdmin={user?.role === 'admin'}
            loading={loading}
          />
        </div>
      )}
      <div>
        {filteredTasks.map(task => (
          <Taskcard
            key={task._id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={user?.role === 'admin'}
            isSelf={task.assignedTo?._id === user?._id}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage; 