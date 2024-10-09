import type { UserInfo } from "./userInfo";

export interface AccountInfo {
  userDetails: UserInfo
  security: Security
  notify: Notify
  authToken: string
}

interface Security {
  emailVerified: boolean
  phoneVerified: boolean
}

interface Notify {
  emailNotify: boolean
  phoneNotify: boolean
}