import projects from './projects'
import tasks from './tasks'
import labels from './labels'

const api = {
    projects: Object.assign(projects, projects),
    tasks: Object.assign(tasks, tasks),
    labels: Object.assign(labels, labels),
}

export default api