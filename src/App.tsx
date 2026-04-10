import { useState, useEffect } from 'react';
import { initialRoutine, DayRoutine, Task } from './data';
import { CheckCircle, Circle, AlertCircle, Flame, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [routines, setRoutines] = useState<DayRoutine[]>(() => {
    const saved = localStorage.getItem('routineTracker_routines');
    return saved ? JSON.parse(saved) : initialRoutine;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('routineTracker_streak');
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('routineTracker_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('routineTracker_streak', JSON.stringify(streak));
  }, [streak]);

  const toggleTask = (day: string, taskId: string) => {
    setRoutines(prev => prev.map(r => 
      r.day === day ? {
        ...r,
        tasks: r.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      } : r
    ));
  };

  const addTask = (day: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      time: '00:00',
      description: 'New Task',
      isCritical: false,
      completed: false,
    };
    setRoutines(prev => prev.map(r => r.day === day ? { ...r, tasks: [...r.tasks, newTask] } : r));
  };

  const removeTask = (day: string, taskId: string) => {
    setRoutines(prev => prev.map(r => r.day === day ? { ...r, tasks: r.tasks.filter(t => t.id !== taskId) } : r));
  };

  const editTask = (day: string, taskId: string, field: keyof Task, value: string | boolean) => {
    setRoutines(prev => prev.map(r => 
      r.day === day ? {
        ...r,
        tasks: r.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t)
      } : r
    ));
  };

  const updateNotes = (day: string, notes: string) => {
    setRoutines(prev => prev.map(r => r.day === day ? { ...r, notes } : r));
  };

  const getProgress = (routine: DayRoutine) => {
    if (routine.tasks.length === 0) return 0;
    const completed = routine.tasks.filter(t => t.completed).length;
    return Math.round((completed / routine.tasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Daily Routine Tracker</h1>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
          <Flame className="text-orange-500" />
          <span className="font-bold text-lg">{streak} Day Streak</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routines.map(routine => {
          const progress = getProgress(routine);
          return (
            <motion.div key={routine.day} className="bg-white p-6 rounded-xl shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-semibold mb-4">{routine.day} ({progress}%)</h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <ul className="space-y-2 mb-4">
                {routine.tasks.map(task => (
                  <li key={task.id} className="flex items-center gap-2">
                    <button onClick={() => toggleTask(routine.day, task.id)}>
                      {task.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-gray-400" />}
                    </button>
                    <input 
                      className="text-sm w-20 p-1 border rounded"
                      value={task.time}
                      onChange={(e) => editTask(routine.day, task.id, 'time', e.target.value)}
                    />
                    <input 
                      className={`text-sm flex-grow p-1 border rounded ${task.completed ? 'line-through text-gray-500' : ''}`}
                      value={task.description}
                      onChange={(e) => editTask(routine.day, task.id, 'description', e.target.value)}
                    />
                    <button onClick={() => removeTask(routine.day, task.id)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {task.isCritical && !task.completed && <AlertCircle className="text-red-500 w-4 h-4" />}
                  </li>
                ))}
              </ul>
              <button onClick={() => addTask(routine.day)} className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-4">
                <Plus className="w-4 h-4" /> Add Task
              </button>
              <textarea 
                className="w-full p-2 border rounded text-sm" 
                placeholder="Notes..."
                value={routine.notes}
                onChange={(e) => updateNotes(routine.day, e.target.value)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
