"use client"
export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white shadow-md p-4 rounded">
      <h2 className="text-lg font-bold">{title}</h2>
      <p>{value}</p>
    </div>
  );
}
