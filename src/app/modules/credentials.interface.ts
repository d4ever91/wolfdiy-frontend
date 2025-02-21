export interface Credentials {
  status: string;
  message: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: number;
  };
  token: string;
}
