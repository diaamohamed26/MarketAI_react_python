
export default function StatCard({ title, value, note, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            {value ?? "—"}
          </h3>
        </div>

        {Icon && (
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <Icon size={22} />
          </div>
        )}
      </div>

      {note && <p className="mt-4 text-xs text-slate-500">{note}</p>}
    </div>
  );
}
