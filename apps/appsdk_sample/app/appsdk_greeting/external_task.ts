export default async function handleExternalTask(payload: any) {
  const greeting = payload?.greeting || 'Hallo';
  const greeting_back = `Antwort auf "${greeting}": Schön, von dir zu hören!`;

  console.log(`[appsdk_greeting] ${greeting} -> ${greeting_back}`);

  return { greeting_back };
}
