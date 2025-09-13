import * as z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  family: z.string(),
  email: z.email(),
})
export type User = z.infer<typeof UserSchema>

export const LoginRespSchema = z.object({
  token: z.string().min(1),
  user: UserSchema
})
export type LoginResp = z.infer<typeof LoginRespSchema>
