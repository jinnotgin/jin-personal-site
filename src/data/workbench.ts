/**
 * Project data now lives as Markdown files in src/content/projects/.
 * This module re-exports everything from src/lib/projects for backward compatibility.
 */
export { projects, projectBySlug, listProjects, getProject } from '@/lib/projects'
