import Api from './Api'
import DashboardController from './DashboardController'
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
import DocumentController from './DocumentController'
import DocFolderController from './DocFolderController'
import QuickThoughtController from './QuickThoughtController'
import QuickThoughtRecordingController from './QuickThoughtRecordingController'
import Settings from './Settings'

const Controllers = {
    Api: Object.assign(Api, Api),
    DashboardController: Object.assign(DashboardController, DashboardController),
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
    DocumentController: Object.assign(DocumentController, DocumentController),
    DocFolderController: Object.assign(DocFolderController, DocFolderController),
    QuickThoughtController: Object.assign(QuickThoughtController, QuickThoughtController),
    QuickThoughtRecordingController: Object.assign(QuickThoughtRecordingController, QuickThoughtRecordingController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers