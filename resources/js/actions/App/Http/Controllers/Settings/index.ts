import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
import EditorController from './EditorController'
import ApiTokenController from './ApiTokenController'
import LlmProviderController from './LlmProviderController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
    EditorController: Object.assign(EditorController, EditorController),
    ApiTokenController: Object.assign(ApiTokenController, ApiTokenController),
    LlmProviderController: Object.assign(LlmProviderController, LlmProviderController),
}

export default Settings