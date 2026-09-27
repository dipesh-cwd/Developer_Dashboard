const parseGithubUrl = (value) => {
  try {
    const url = new URL(value)

    if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com') {
      return null
    }

    const parts = url.pathname.split('/').filter(Boolean)

    if (parts.length < 2) {
      return null
    }

    const owner = parts[0]
    const repo = parts[1].replace(/\.git$/, '')

    if (!owner || !repo) {
      return null
    }

    return { owner, repo }
  } catch {
    return null
  }
}

const getRepository = async (githubUrl) => {
  const parsed = parseGithubUrl(githubUrl)

  if (!parsed) {
    const error = new Error('A valid GitHub repository URL is required')
    error.statusCode = 400
    throw error
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Developer-Dashboard',
  }

  const repoResponse = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`,
    { headers }
  )

  if (!repoResponse.ok) {
    const error = new Error(
      repoResponse.status === 404
        ? 'GitHub repository not found or is not public'
        : `GitHub API request failed (${repoResponse.status})`
    )
    error.statusCode = repoResponse.status === 404 ? 404 : 502
    throw error
  }

  const repository = await repoResponse.json()

  const commitsResponse = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}/commits?per_page=5`,
    { headers }
  )

  let recentCommits = []

  if (commitsResponse.ok) {
    const commits = await commitsResponse.json()
    recentCommits = commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit?.message?.split('\n')[0] || 'No commit message',
      author: commit.commit?.author?.name || commit.author?.login || 'Unknown',
      date: commit.commit?.author?.date || null,
      url: commit.html_url,
    }))
  }

  return {
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description,
    htmlUrl: repository.html_url,
    defaultBranch: repository.default_branch,
    language: repository.language,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    openIssues: repository.open_issues_count,
    visibility: repository.visibility,
    updatedAt: repository.updated_at,
    recentCommits,
  }
}

module.exports = {
  parseGithubUrl,
  getRepository,
}
