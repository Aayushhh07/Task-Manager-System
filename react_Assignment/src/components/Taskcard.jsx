import React from 'react';

const Taskcard = ({ task, onEdit, onDelete, isAdmin, isSelf }) => (
  <div className="bg-white shadow rounded p-4 mb-4">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{task.title}</h3>
        <div className="text-sm text-gray-600">Assigned to: {task.assignedTo?.name} ({task.assignedTo?.email})</div>
        <div className="text-xs text-gray-400">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
      </div>
      <div className="flex gap-2">
        {(isAdmin || isSelf) && (
          <>
            <button onClick={() => onEdit(task)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
            <button onClick={() => onDelete(task._id)} className="bg-red-500 px-2 py-1 rounded text-white">Delete</button>
          </>
        )}
      </div>
    </div>
    <div className="mt-2">
      <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 mr-2">{task.priority}</span>
      <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700 mr-2">{task.status}</span>
    </div>
    <div className="mt-2 text-gray-700">{task.description}</div>
    {task.attachments && task.attachments.length > 0 && (
      <div className="mt-2">
        <div className="font-medium text-sm">Attachments:</div>
        <ul className="list-disc ml-6">
          {task.attachments.map((file, idx) => (
            <li key={idx}>
              <a href={`/${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download PDF {idx + 1}</a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default Taskcard; 