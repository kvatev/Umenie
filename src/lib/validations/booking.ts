import { z } from "zod";

// Bulgarian phone regex: +359 followed by 9 digits OR 0 followed by 9 digits
export const BG_PHONE_REGEX = /^(\+359|0)[0-9]{9}$/;

export const BookingSchema = z.object({
  scheduleId: z.string().optional(),
  activityName: z.string().min(1, "Моля, посочете име на заниманието"),
  childName: z.string().min(2, "Името на детето трябва да съдържа поне 2 символа"),
  childAge: z.string().min(1, "Моля, изберете възраст на детето"),
  parentName: z.string().min(2, "Името на родителя трябва да съдържа поне 2 символа"),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s\-()]/g, "")) // strip spaces, hyphens, parentheses
    .pipe(
      z.string().regex(
        BG_PHONE_REGEX,
        "Моля, въведете валиден български телефонен номер (напр. 0881234567 или +359881234567)"
      )
    ),
  email: z
    .string()
    .trim()
    .email("Моля, въведете валиден имейл адрес")
    .optional()
    .or(z.literal("")),
  consentMarketing: z.boolean().default(false),
});

export type BookingInput = z.infer<typeof BookingSchema>;

export interface BookingResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  bookingId?: string;
}
