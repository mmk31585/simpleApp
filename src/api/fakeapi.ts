import type { LoginResponse } from "@/types/response";
import type { User } from "@/types/user";
const memory = {
  users: [{ id: 1, name: "محمد مهدی", family: "کبیری", email: "mmk@gmail.com" } as User],
  token: "jwt_dev_token_123",
};

export async function Login(email: string, password: string): Promise<LoginResponse> {
  if (email === "mmk@gmail.com" && password === "123456789") {
    return { token: memory.token, user: memory.users[0] };
  } else {
    throw new Error("ایمیل یا رمز عبور اشتباه است");
  }
}

export async function Info(token: string): Promise<User> {
  if (token === memory.token) {
    return memory.users[0];
  } else {
    throw new Error("توکن نامعتبر");
  }
}
