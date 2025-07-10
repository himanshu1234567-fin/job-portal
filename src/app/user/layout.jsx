export default function UserLayout({ children }) {
  return (
    <section className="min-h-screen bg-white">
      <h1 className="text-3xl font-bold p-4">User Dashboard</h1>
      {children}
    </section>
  );
}
