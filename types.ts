export enum ModelStatus {
  Online = 'Online',
  Offline = 'Offline',
}

export interface Product {
  id: number;
  duration: number; // in minutes
  price: number;
  productHash: string; // From Frendz.com.br API
  offerHash: string; // From Frendz.com.br API
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  profilePic?: string | null;
  response?: string; // Model's response
  isLeadComment?: boolean; // New property to hide lead comments
}

export interface Model {
  id: string;
  name: string;
  age: number;
  bio: string;
  profileImage: string;
  galleryImages: string[];
  videoUrl: string;
  status: ModelStatus;
  products: Product[];
  reviews: Review[];
}

export interface CartItem {
  model: Model;
  product: Product;
}

export interface PurchasedCall {
    model: Model;
    product: Product;
    purchaseTime: number;
    feedbackSubmitted?: boolean;
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface VerificationDetails {
  documentType: 'drivers_license' | 'passport' | 'national_id';
  documentNumber: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  name: string;
  email: string;
  profilePic: string | null; // URL to the profile picture
  verificationStatus: VerificationStatus;
  purchaseHistory: PurchasedCall[];
  verificationDetails?: VerificationDetails;
  bio?: string;
  favorites: string[]; // Array of model IDs
  notifications: Notification[];
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
}