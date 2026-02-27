import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTaskById, updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import {
  formatDateTime,
  getDueDateLabel,
  isOverdue
} from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskForm from '../../components/tasks/TaskForm';

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const loadTask = async () => {
    setLoading(true);
    const result = await getTaskById(taskId);

    if (result.success) {
      setTask(result.task);
    } else {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleToggleComplete = async () => {
    if (!task) return;

    const result = await updateTask(taskId, { completed: !task.completed });

    if (result.success) {
      setTask({ ...task, completed: !task.completed });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

    const result = await deleteTask(taskId);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (editing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <TaskForm
          taskToEdit={task}
          onClose={() => {
            setEditing(false);
            loadTask();
          }}
        />
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === task.category);
  const priority = PRIORITIES.find((p) => p.id === task.priority);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          Volver al Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {task.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {category && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium bg-${category.color}-100 text-${category.color}-800`}
                >
                  {category.label}
                </span>
              )}

              {priority && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium bg-${priority.color}-100 text-${priority.color}-800`}
                >
                  {priority.label}
                </span>
              )}

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.completed ? 'Completada' : 'Pendiente'}
              </span>

              {task.dueDate && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isOverdue(task.dueDate, task.completed)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Vence: {getDueDateLabel(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Editar
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Eliminar
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Descripción
          </h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {task.description || 'Sin descripción'}
          </p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Información adicional
          </h2>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Creada</dt>
              <dd className="text-gray-900">{formatDateTime(task.createdAt)}</dd>
            </div>

            {task.dueDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Fecha de vencimiento
                </dt>
                <dd className="text-gray-900">{formatDateTime(task.dueDate)}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6 mt-6">
          <button
            onClick={handleToggleComplete}
            className={task.completed ? 'btn-secondary w-full' : 'btn-primary w-full'}
          >
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          </button>
        </div>
      </div>
    </div>
  );
}