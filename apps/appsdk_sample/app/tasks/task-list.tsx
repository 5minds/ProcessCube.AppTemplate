'use client';

import { useEffect, useState } from 'react';
import { fetchWaitingUserTasks } from '../actions';

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    let active = true;

    async function poll() {
      while (active) {
        try {
          const result = await fetchWaitingUserTasks();
          if (active) setTasks(result);
        } catch {}
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    poll();
    return () => { active = false; };
  }, []);

  if (tasks.length === 0) {
    return <p>Keine wartenden Tasks.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
      {tasks.map((task: any) => (
        <a
          key={task.flowNodeInstanceId}
          href={`/usertask/${task.flowNodeInstanceId}`}
          style={{
            display: 'block',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <strong>{task.flowNodeName}</strong>
          <br />
          <small style={{ color: '#666' }}>{task.processModelId}</small>
        </a>
      ))}
    </div>
  );
}
