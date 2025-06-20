import React, { useState, useEffect } from 'react';

const priorities = ['low', 'medium', 'high'];
const statuses = ['pending', 'in progress', 'completed'];

const TaskForm = ({ onSubmit, initialValues = {}, users = [], isAdmin = false, loading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    attachments: [],
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm((f) => ({ ...f, ...initialValues }));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, attachments: Array.from(e.target.files) }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = 'Title is required';
    if (form.attachments.some(f => f.type !== 'application/pdf')) errs.attachments = 'Only PDF files allowed';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="block font-medium">Title *</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full" />
        {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full" />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="block font-medium">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block font-medium">Due Date</label>
        <input type="date" name="dueDate" value={form.dueDate ? form.dueDate.slice(0,10) : ''} onChange={handleChange} />
      </div>
      <div>
        <label className="block font-medium">Assign To</label>
        {isAdmin ? (
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
            <option value="">Select user</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
          </select>
        ) : (
          <input type="text" value={form.assignedTo} disabled className="bg-gray-100" />
        )}
      </div>
      <div>
        <label className="block font-medium">Attachments (PDF only)</label>
        <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
        {errors.attachments && <div className="text-red-500 text-sm">{errors.attachments}</div>}
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Task'}</button>
    </form>
  );
};

export default TaskForm; 