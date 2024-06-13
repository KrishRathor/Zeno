export interface IDeveloperOnBoarding {
  username: string,
  password: string,
  email: string
}

export interface IDeveloperOnBoardingResponse {
  code: number,
  message: string,
  developer: any
}

export interface IDeveloperVerify {
  appId: string
}

export interface IDeveloperVerifyResponse {
  code: number,
  message: string,
  isVerified: boolean | null
}
