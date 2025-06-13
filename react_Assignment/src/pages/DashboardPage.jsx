import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice';
import TaskCard from '../components/Taskcard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/navbar';

function DashboardPage() {
  const dispatch = useDispatch();
  const { tasks = [], loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
    }
  }, [dispatch, user]);

  const filteredTasks = tasks.filter((task) => {
    if (!user) return false;

    const assignedToId = task?.assignedTo?._id || task?.assignedTo;

    // Admin can see all tasks
    if (user.role === 'admin') {
      if (filter === 'completed') return task.status === 'completed';
      if (filter === 'pending') return task.status !== 'completed';
      return true;
    }

    // Normal user sees only their assigned tasks
    if (assignedToId !== user._id) return false;

    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status !== 'completed';
    return true;
  });

  const handleTaskEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleTaskFormClose = () => {
    setShowForm(false);
    setEditTask(null);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="w-full min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.role === 'admin' ? 'All Tasks' : 'My Tasks'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === 'admin'
                  ? 'Manage and assign tasks for all users'
                  : 'Manage and track your tasks efficiently'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex rounded-lg shadow-sm">
                {['all', 'pending', 'completed'].map((type, idx) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 text-sm font-medium ${
                      idx === 0
                        ? 'rounded-l-lg'
                        : idx === 2
                        ? 'rounded-r-lg'
                        : ''
                    } ${
                      filter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type[0].toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowForm((prev) => !prev);
                  setEditTask(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {showForm ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Task
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <TaskForm
              onClose={handleTaskFormClose}
              refreshTasks={() => dispatch(fetchTasks())}
              taskToEdit={editTask}
            />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all'
                ? 'Get started by creating a new task.'
                : filter === 'completed'
                ? 'No completed tasks yet.'
                : 'No pending tasks.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleTaskEdit} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
