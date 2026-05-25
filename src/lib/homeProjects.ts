import type { ProjectMeta, ThreadId } from '@/data/types'
import { homeProjects } from '@generated/homeProjects'

export function listProjects(): ProjectMeta[] {
	return homeProjects
}

const latestYear = (project: ProjectMeta) => {
	if (project.year.toLowerCase().includes('now')) return Number.MAX_SAFE_INTEGER
	const years = project.year.match(/\d{4}/g)?.map(Number) ?? []
	return Math.max(...years, 0)
}

const firstYear = (project: ProjectMeta) => {
	const years = project.year.match(/\d{4}/g)?.map(Number) ?? []
	return Math.min(...years, 0)
}

export const byMostRecentProject = (a: ProjectMeta, b: ProjectMeta) =>
	latestYear(b) - latestYear(a) || firstYear(b) - firstYear(a)

export function projectsByThread(threadId: string): ProjectMeta[] {
	return homeProjects.filter((p) => p.threads.includes(threadId as ThreadId))
}
