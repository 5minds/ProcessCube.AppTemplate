'use client';

import { useEffect, useState, useCallback } from 'react';
import { startSampleProcess, fetchWaitingUserTasks, fetchUserTaskById, completeUserTask } from './actions';

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [view, setView] = useState<'tasks' | 'detail'>('tasks');

  const loadTasks = useCallback(async () => {
    try {
      const result = await fetchWaitingUserTasks();
      setTasks(result);
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    async function poll() {
      while (active) {
        await loadTasks();
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    poll();
    return () => { active = false; };
  }, [loadTasks]);

  useEffect(() => {
    if (!selectedTaskId) {
      setSelectedTask(null);
      setView('tasks');
      return;
    }
    fetchUserTaskById(selectedTaskId).then((task) => {
      if (task) {
        setSelectedTask(task);
        setView('detail');
      } else {
        setSelectedTask(null);
        setSelectedTaskId(null);
        setView('tasks');
      }
    });
  }, [selectedTaskId]);

  async function handleStart() {
    await startSampleProcess();
    await loadTasks();
  }

  function handleBack() {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setView('tasks');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTask) return;
    const formData = new FormData(e.currentTarget);
    const result: Record<string, any> = {};
    for (const field of selectedTask.userTaskConfig?.formFields ?? []) {
      result[field.id] = formData.get(field.id) ?? '';
    }
    await completeUserTask(selectedTask.flowNodeInstanceId, result);
    handleBack();
    await loadTasks();
  }

  const formFields = selectedTask?.userTaskConfig?.formFields ?? [];

  return (
    <>
      {/* Menu Bar */}
      <nav className="menu-bar">
        <div className="logo">
          <span className="logo-dot" />
          AppSDK Sample
        </div>
        <button className="btn btn-primary" onClick={handleStart}>
          Prozess starten
        </button>
        <button
          className={`btn btn-secondary ${view === 'tasks' && !selectedTaskId ? 'active' : ''}`}
          onClick={handleBack}
        >
          Wartende UserTasks
        </button>
      </nav>

      {/* Content */}
      <div className="content">
        {view === 'detail' && selectedTask ? (
          <>
            <button className="back-link" onClick={handleBack}>
              &larr; Zurück zur Liste
            </button>
            <div className="task-detail">
              <div className="task-detail-header">
                <h2>{selectedTask.flowNodeName}</h2>
                <span className="process-name">{selectedTask.processModelId}</span>
              </div>
              <form onSubmit={handleSubmit}>
                {formFields.map((field: any) => (
                  <div key={field.id} className="form-group">
                    <label htmlFor={field.id} className="form-label">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type="text"
                      defaultValue={field.defaultValue ?? ''}
                      className="form-input"
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Abschließen
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <h2>Wartende UserTasks</h2>
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">&#9744;</div>
                <p>Keine wartenden Tasks</p>
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task: any) => (
                  <button
                    key={task.flowNodeInstanceId}
                    className="task-card"
                    onClick={() => setSelectedTaskId(task.flowNodeInstanceId)}
                  >
                    <div className="task-name">{task.flowNodeName}</div>
                    <div className="task-process">{task.processModelId}</div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span className="status-dot" />
        <span>External Task Worker: appsdk_greeting</span>
        <span>Tasks: {tasks.length}</span>
      </div>
    </>
  );
}
