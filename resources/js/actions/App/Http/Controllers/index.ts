import Api from './Api'
import DashboardController from './DashboardController'
import HubController from './HubController'
import ZenController from './ZenController'
import SearchController from './SearchController'
import WorkspaceController from './WorkspaceController'
import InvitationController from './InvitationController'
import MergedTasksController from './MergedTasksController'
import MergedDocsController from './MergedDocsController'
import ProjectController from './ProjectController'
import TaskController from './TaskController'
import TimeEntryController from './TimeEntryController'
import AudioRecordingController from './AudioRecordingController'
import CommentController from './CommentController'
import LabelController from './LabelController'
import SubtaskController from './SubtaskController'
import TaskDependencyController from './TaskDependencyController'
import SprintController from './SprintController'
import PlanController from './PlanController'
import DocumentController from './DocumentController'
import DocumentCommentController from './DocumentCommentController'
import DocFolderController from './DocFolderController'
import QuickThoughtController from './QuickThoughtController'
import QuickThoughtRecordingController from './QuickThoughtRecordingController'
import Settings from './Settings'

const Controllers = {
    Api: Object.assign(Api, Api),
    DashboardController: Object.assign(DashboardController, DashboardController),
    HubController: Object.assign(HubController, HubController),
    ZenController: Object.assign(ZenController, ZenController),
    SearchController: Object.assign(SearchController, SearchController),
    WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
    InvitationController: Object.assign(InvitationController, InvitationController),
    MergedTasksController: Object.assign(MergedTasksController, MergedTasksController),
    MergedDocsController: Object.assign(MergedDocsController, MergedDocsController),
    ProjectController: Object.assign(ProjectController, ProjectController),
    TaskController: Object.assign(TaskController, TaskController),
    TimeEntryController: Object.assign(TimeEntryController, TimeEntryController),
    AudioRecordingController: Object.assign(AudioRecordingController, AudioRecordingController),
    CommentController: Object.assign(CommentController, CommentController),
    LabelController: Object.assign(LabelController, LabelController),
    SubtaskController: Object.assign(SubtaskController, SubtaskController),
    TaskDependencyController: Object.assign(TaskDependencyController, TaskDependencyController),
    SprintController: Object.assign(SprintController, SprintController),
    PlanController: Object.assign(PlanController, PlanController),
    DocumentController: Object.assign(DocumentController, DocumentController),
    DocumentCommentController: Object.assign(DocumentCommentController, DocumentCommentController),
    DocFolderController: Object.assign(DocFolderController, DocFolderController),
    QuickThoughtController: Object.assign(QuickThoughtController, QuickThoughtController),
    QuickThoughtRecordingController: Object.assign(QuickThoughtRecordingController, QuickThoughtRecordingController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers