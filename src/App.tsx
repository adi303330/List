import { useState, useEffect } from 'react';
import { initialRoutine, DayRoutine } from './data';
import { CheckCircle, Circle, AlertCircle, Flame } from 'lucide-react';
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

  const updateNotes = (day: string, notes: string) => {
    setRoutines(prev => prev.map(r => r.day === day ? { ...r, notes } : r));
  };

  const getProgress = (routine: DayRoutine) => {
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
                    <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.time} - {task.description}
                      {task.isCritical && !task.completed && <AlertCircle className="inline ml-2 text-red-500 w-4 h-4" />}
                    </span>
                  </li>
                ))}
              </ul>
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
