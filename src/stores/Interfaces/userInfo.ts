export interface UserInfo {
  id: number
  firstName: string
  lastName: string
  userGroup: string
  userImage?: string;
  email: string
  phone: string
  emailVerified: boolean
  dob: string
  gender: string
}