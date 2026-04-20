import TaskList from './task-list';

export default function TasksPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Wartende UserTasks</h1>
      <a href="/" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>&larr; Zurück</a>
      <TaskList />
    </main>
  );
}
