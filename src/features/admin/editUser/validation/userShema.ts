import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .min(1, { message: '12文字以内で入力してください' })
    .max(12, { message: '12文字以内で入力してください' }),
  uuid: z
    .string()
    .regex(new RegExp('^[0-9a-f]*$'), { message: '0〜9とa〜fで入力してください' })
    .min(5, { message: '5文字で入力してください' })
    .max(5, { message: '5文字で入力してください' }),
  email: z
    .string()
    .regex(new RegExp('^$|@gmail.com$'), { message: '〜@gmail.comの形式で入力してください' }),
  // .email({ message: '有効なメールアドレスを入力してください' })
  // .min(1, { message: '必須項目です' }),
  role: z.string(),
  communityId: z.number(),
  beaconName: z.string().min(1, { message: '必須項目です' }),
  tagNames: z.array(z.string()).min(1, { message: '少なくとも1つは選択してください' }),
});

export type CreateInputType = z.infer<typeof userSchema>;
