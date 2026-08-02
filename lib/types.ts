import type { LucideIcon } from "lucide-react";

export type IRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type IUserStatus = "ACTIVE" | "BLOCKED";

export type IRentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export type IPaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type IPaymentMethod = "STRIPE" | "SSLCOMMERZ";

export interface IApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: IApiMeta;
}

export interface ICounts {
  providedGear?: number;
  rentals?: number;
  gearItems?: number;
  rentalOrders?: number;
  reviews?: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: IRole;
  status: IUserStatus;
  profilePhoto?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: ICounts;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { gearItems: number };
}

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerId: string;
  gearItemId: string;
  customer?: IUser;
}

export interface IGearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  image?: string | null;
  quantity: number;
  isAvailable: boolean;
  providerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: ICategory;
  provider?: IUser;
  reviews?: IReview[];
  _count?: ICounts;
}

export interface IRentalOrder {
  id: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: IRentalStatus;
  customerId: string;
  gearItemId: string;
  createdAt: string;
  updatedAt: string;
  gearItem?: IGearItem;
  customer?: IUser;
  payment?: IPayment | null;
}

export interface IPayment {
  id: string;
  transactionId?: string | null;
  amount: number;
  method: IPaymentMethod;
  status: IPaymentStatus;
  stripePaymentIntentId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  rentalOrderId: string;
  userId: string;
  rentalOrder?: IRentalOrder;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: IRole;
  profilePhoto?: string;
  phone?: string;
  address?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ICreateRentalPayload {
  gearItemId: string;
  quantity: number;
  startDate: string;
  endDate: string;
}

export interface ICreatePaymentIntentPayload {
  rentalOrderId: string;
  method: IPaymentMethod;
}

export interface ICreatePaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
  amount: number;
}

export interface IConfirmPaymentPayload {
  paymentIntentId: string;
  rentalOrderId: string;
}

export interface ICreateReviewPayload {
  gearItemId: string;
  rating: number;
  comment: string;
}

export interface ICreateGearPayload {
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  image?: string;
  quantity?: number;
  categoryId: string;
}

export interface IUpdateGearPayload {
  name?: string;
  description?: string;
  brand?: string;
  pricePerDay?: number;
  image?: string;
  quantity?: number;
  isAvailable?: boolean;
  categoryId?: string;
}

export interface ISidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}
