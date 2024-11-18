import { servicesAxiosInstance } from './config';
import { HealthApiResponse } from '../types/healthTypes';
import { AccountConfirmationData, AccountConfirmationResponse, SignInData, SignInResponse, SignUpData, SignUpResponse, ForgotPasswordData,ForgotPasswordResponse  } from '../types/authenticationTypes';

export const getServerStatus = async (): Promise<HealthApiResponse> => {
  const response = await servicesAxiosInstance.get<HealthApiResponse>('/api/v1/health');
  return response.data;
};

export const SignUpapi = async (data: SignUpData): Promise<SignUpResponse> => {
  const response = await servicesAxiosInstance.post<SignUpResponse>('/api/v1/register', data);
  return response.data;
};


export const SignInapi = async (data: SignInData): Promise<SignInResponse> => {
  const response = await servicesAxiosInstance.post<SignInResponse>('/api/v1/login', data);
  return response.data;
}

export const AccountConfirmationapi = async (data: AccountConfirmationData): Promise<AccountConfirmationResponse> => {
  const response = await servicesAxiosInstance.put<AccountConfirmationResponse>(`/api/v1/confirmation/${data.token}?code=${data.code}`);
  return response.data;
};

export const ForgotPasswordapi = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
  const response = await servicesAxiosInstance.put<ForgotPasswordResponse>('/api/v1/forgot-password', data);
  return response.data;
}