export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  createdAt: string;
}