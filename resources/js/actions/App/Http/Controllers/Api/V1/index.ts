import AuthController from './AuthController'
import WorkspaceController from './WorkspaceController'
import ProjectController from './ProjectController'
import TaskController from './TaskController'
import TimeEntryController from './TimeEntryController'
import CommentController from './CommentController'
import LabelController from './LabelController'
import DocumentController from './DocumentController'
import SubtaskController from './SubtaskController'

const V1 = {
    AuthController: Object.assign(AuthController, AuthController),
    WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
    ProjectController: Object.assign(ProjectController, ProjectController),
    TaskController: Object.assign(TaskController, TaskController),
    TimeEntryController: Object.assign(TimeEntryController, TimeEntryController),
    CommentController: Object.assign(CommentController, CommentController),
    LabelController: Object.assign(LabelController, LabelController),
    DocumentController: Object.assign(DocumentController, DocumentController),
    SubtaskController: Object.assign(SubtaskController, SubtaskController),
}

export default V1