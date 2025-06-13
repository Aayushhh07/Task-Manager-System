import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskById } from '../redux/taskSlice';
import { useEffect } from 'react';

function TaskDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { task, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTaskById(id));
  }, [id, dispatch]);

  if (loading || !task) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">{task.title}</h2>
      <p className="text-gray-700 mb-4">{task.description}</p>

      <div className="mb-4 space-y-1 text-sm">
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
        {task.assignedTo && <p><strong>Assigned To:</strong> {task.assignedTo.name || task.assignedTo}</p>}
      </div>

      {task.attachments?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Attachments:</h4>
          {task.attachments.map((file, idx) => (
            <a key={idx}
              href={`http://localhost:4000/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 underline"
            >
              📄 Document {idx + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskDetailPage;
