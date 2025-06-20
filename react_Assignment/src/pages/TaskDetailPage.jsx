import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksThunk, deleteTaskThunk } from '../redux/taskSlice';
import Loader from '../components/Loader';
import Taskcard from '../components/Taskcard';

const TaskDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const task = tasks.find(t => t._id === id);

  useEffect(() => {
    if (!task) dispatch(fetchTasksThunk());
  }, [dispatch, task]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTaskThunk(id)).then(() => navigate('/'));
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!task) return <div>Task not found.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="text-blue-600 underline">&larr; Back to Dashboard</Link>
      <Taskcard
        task={task}
        onEdit={() => {}}
        onDelete={handleDelete}
        isAdmin={user?.role === 'admin'}
        isSelf={task.assignedTo?._id === user?._id}
      />
    </div>
  );
};

export default TaskDetailPage; 