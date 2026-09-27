const StatCard = ({ title, value, description }) => (
  <article className="ui-card ui-card-hover relative overflow-hidden p-5 sm:p-6">
    <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-slate-50" />
    <div className="relative">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>
    </div>
  </article>
)

export default StatCard
