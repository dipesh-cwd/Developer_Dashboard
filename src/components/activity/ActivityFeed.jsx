import { Link } from 'react-router'

const formatRelativeTime = (value) => {
  if (!value) return 'Recently'

  const date = new Date(value)
  const diff = Date.now() - date.getTime()

  if (Number.isNaN(date.getTime())) return 'Recently'
  if (diff < 60 * 1000) return 'Just now'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`

  return date.toLocaleDateString()
}

const activityStyles = {
  project: 'bg-violet-100 text-violet-700',
  task: 'bg-amber-100 text-amber-700',
  commit: 'bg-slate-100 text-slate-700',
  issue: 'bg-emerald-100 text-emerald-700',
  pullRequest: 'bg-blue-100 text-blue-700',
}

const ActivityFeed = ({ activities = [], emptyMessage = 'No activity yet.', limit = 8 }) => {
  const visibleActivities = activities.slice(0, limit)

  return (
    <div className="space-y-3">
      {visibleActivities.length ? visibleActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
        >
          <span className={`mt-0.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${activityStyles[activity.type] || 'bg-slate-100 text-slate-700'}`}>
            {activity.label}
          </span>

          <div className="min-w-0 flex-1">
            {activity.href ? (
              <a
                href={activity.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-900 hover:underline"
              >
                {activity.title}
              </a>
            ) : activity.projectId ? (
              <Link
                to={`/projects/${activity.projectId}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {activity.title}
              </Link>
            ) : (
              <p className="font-medium text-slate-900">{activity.title}</p>
            )}

            {activity.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {activity.description}
              </p>
            )}
          </div>

          <time className="shrink-0 text-xs text-slate-400">
            {formatRelativeTime(activity.date)}
          </time>
        </div>
      )) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}

export default ActivityFeed
