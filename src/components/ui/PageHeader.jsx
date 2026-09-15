const PageHeader = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default PageHeader