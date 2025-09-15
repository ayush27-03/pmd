// components/StatCard.jsx
export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h1 className="text-sm font-medium text-gray-500">{title}</h1>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}