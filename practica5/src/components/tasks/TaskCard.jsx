import { Link } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';

export default function TaskCard({ task }) {
  const category = CATEGORIES.find((c) => c.id === task.category);

  const handleToggleComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await updateTask(task.id, { completed: !task.completed });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      await deleteTask(task.id);
    }
  };

  const isTaskOverdue = isOverdue(task.dueDate, task.completed);
  const cardClasses = `card hover:shadow-lg transition-shadow mb-4 flex flex-col justify-between 
    ${task.completed ? 'opacity-60 bg-gray-50' : 'bg-white'} 
    ${isTaskOverdue ? 'border-2 border-red-500' : ''}`;

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div className={cardClasses}>
        
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          {category && (
            <span className={`px-2 py-1 rounded text-xs font-semibold bg-${category.color}-100 text-${category.color}-800`}>
              {category.label}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          
          <div className="text-sm">
            {task.dueDate && (
              <span className={`font-medium ${isTaskOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                📅 {getDueDateLabel(task.dueDate)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleComplete}
              className={`p-2 rounded-full transition-colors ${
                task.completed 
                  ? 'text-yellow-600 hover:bg-yellow-100' 
                  : 'text-green-600 hover:bg-green-100'
              }`}
              title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            >
              {task.completed ? '↩️' : '✅'}
            </button>
            
            <button
              onClick={handleDelete}
              className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
              title="Eliminar tarea"
            >
              🗑️
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}