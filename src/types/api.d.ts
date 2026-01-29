export type TokenResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type TokenRefreshResponse = {
  access: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type PaymentStatus = "paid" | "pending";
export type PaymentType = "pix" | "credit" | "debit" | "cash";

export type OrganizationPayment = {
  id: number;
  user: number;
  name: string;
  amount: string;
  status: PaymentStatus;
  status_display: string;
  payment_type: PaymentType;
  payment_type_display: string;
  installments: number | null;
  installment_amount: string;
  expense_date: string;
  expected_end_date: string | null;
  paid_at: string | null;
  external_reference: string | null;
  remaining_amount: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationPaymentListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrganizationPayment[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type PaymentStats = {
  total_pagos: number;
  total_pendentes: number;
  total_credito: number;
  total_geral: number;
  quantidade_total: number;
  quantidade_pagos: number;
  quantidade_pendentes: number;
  quantidade_credito: number;
};
