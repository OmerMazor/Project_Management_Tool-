export interface Response {
  success: boolean;
  statusCode: number;
  request: {
    ip: string;
    method: string;
    url: string;
  };
  message: string;
}

export interface SignUpResponse extends Response {
  data: {
    _id: string;
  };
}

export interface SignUpData {
  name: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  consent: boolean;
}

export interface AccountConfirmationData {
  token: string;
  code: string;
}

export interface AccountConfirmationResponse extends Response {
  data?: {
    email: string;
  };
}

export interface SignInData {
  emailAddress: string;
  password: string;
}

export interface SignInResponse extends Response {
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ForgotPasswordData {
  emailAddress: string;
}

export interface ForgotPasswordResponse extends Response {
  data: null 
}