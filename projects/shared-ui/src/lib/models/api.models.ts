export interface UserResponse {
  id: string;
  username: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  token: string;
}

export interface CarResponse {
  id: string;
  name: string;
}

export interface FuelEntryResponse {
  id: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  email?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface CarRequest {
  name?: string;
}

export interface FuelEntryRequest {
  date: string;
  odometer: number | null;
  liters: number | null;
  pricePerLiter: number | null;
}
