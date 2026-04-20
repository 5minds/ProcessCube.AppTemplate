import './globals.css';

export const metadata = {
  title: 'AppSDK Sample - ProcessCube AppTemplate',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
