export interface Address {
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  createdAt: string;
}

export interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
}