import ApiService from '../api';
import {
  OrganizationPayment,
  OrganizationPaymentListResponse,
  PaymentStats,
} from '~/types/api';

export const getOrganizationPaymentsAPI = (params?: Record<string, unknown>) => {
  return ApiService.HttpGet<OrganizationPaymentListResponse>({
    route: 'api/organization-payment/',
    params,
    token: true,
  });
};

export const getOrganizationPaymentByIdAPI = (id: number) => {
  return ApiService.HttpGet<OrganizationPayment>({
    route: `api/organization-payment/${id}/`,
    token: true,
  });
};

export const createOrganizationPaymentAPI = (data: Partial<OrganizationPayment>) => {
  return ApiService.HttpPost<OrganizationPayment>({
    route: 'api/organization-payment/',
    body: data,
    token: true,
  });
};

export const updateOrganizationPaymentAPI = (
  id: number,
  data: Partial<OrganizationPayment>
) => {
  return ApiService.HttpPut<OrganizationPayment>({
    route: `api/organization-payment/${id}/`,
    body: data,
    token: true,
  });
};

export const patchOrganizationPaymentAPI = (
  id: number,
  data: Partial<OrganizationPayment>
) => {
  return ApiService.HttpPatch<OrganizationPayment>({
    route: `api/organization-payment/${id}/`,
    body: data,
    token: true,
  });
};

export const deleteOrganizationPaymentAPI = (id: number) => {
  return ApiService.HttpDelete({
    route: `api/organization-payment/${id}/`,
    token: true,
  });
};

export const getOrganizationPaymentStatsAPI = () => {
  return ApiService.HttpGet<PaymentStats>({
    route: 'api/organization-payment/stats/',
    token: true,
  });
};
