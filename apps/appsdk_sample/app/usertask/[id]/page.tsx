import { fetchWaitingUserTasks, completeUserTask } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function UserTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userTasks = await fetchWaitingUserTasks();
  const task = userTasks.find((t: any) => t.flowNodeInstanceId === id);

  if (!task) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Task nicht gefunden</h1>
        <a href="/tasks">&larr; Zurück zur Übersicht</a>
      </main>
    );
  }

  const formFields = task.userTaskConfig?.formFields ?? [];

  async function submitTask(formData: FormData) {
    'use server';
    const result: Record<string, any> = {};
    for (const field of formFields) {
      result[field.id] = formData.get(field.id) ?? '';
    }
    await completeUserTask(id, result);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '600px' }}>
      <a href="/tasks" style={{ display: 'inline-block', marginBottom: '1rem' }}>&larr; Zurück</a>
      <h1>{task.flowNodeName}</h1>
      <p style={{ color: '#666' }}>{task.processModelId}</p>

      <form action={submitTask} style={{ marginTop: '1.5rem' }}>
        {formFields.map((field: any) => (
          <div key={field.id} style={{ marginBottom: '1rem' }}>
            <label htmlFor={field.id} style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type="text"
              defaultValue={field.defaultValue ?? ''}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}
        >
          Abschließen
        </button>
      </form>
    </main>
  );
}
