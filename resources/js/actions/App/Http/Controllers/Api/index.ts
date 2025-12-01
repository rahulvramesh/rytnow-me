import V1 from './V1'
import LiveblocksController from './LiveblocksController'
import UserController from './UserController'

const Api = {
    V1: Object.assign(V1, V1),
    LiveblocksController: Object.assign(LiveblocksController, LiveblocksController),
    UserController: Object.assign(UserController, UserController),
}

export default Api