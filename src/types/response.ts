interface User {
  id: number;
  name: string;
  family: string;
  email: string;
}


export interface LoginResponse {
  token: string
  user: User
}
