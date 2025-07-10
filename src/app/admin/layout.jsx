export default function AdminLayout({ children }) {
  return (
    <section className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold p-4">Admin Panel</h1>
      {children}
    </section>
  );
}
