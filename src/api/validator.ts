import * as z from 'zod';
import type { User } from '@/types/user';
import type { LoginResponse } from '@/types/response';

export const UserSchema: z.ZodType<User> = z.object({
  id: z.number(),
  name: z.string(),
  family: z.string(),
  email: z.email(),
})
export const LoginRespSchema: z.ZodType<LoginResponse> = z.object({
  token: z.string().min(1),
  user: UserSchema,
});
