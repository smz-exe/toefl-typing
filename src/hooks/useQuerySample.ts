import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

type User = z.infer<typeof UserSchema>;

export const useQuerySample = () => {
  return useQuery<User[]>(['users'], async () => {
    const res = await fetch('/api/users');
    const json = await res.json();
    return UserSchema.array().parse(json);
  });
};