import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "PROVIDER"], {
    required_error: "Please select a role",
  }),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 6, "Phone number is too short"),
  address: z.string().optional(),
});

export const rentalSchema = z
  .object({
    quantity: z.coerce.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

export const gearSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  pricePerDay: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  quantity: z.coerce.number().int().min(0).optional().default(1),
  image: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Please select a category"),
  isAvailable: z.boolean().optional(),
});

export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Select at least 1 star")
    .max(5, "Maximum 5 stars"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
});

export type ILoginFormValues = z.infer<typeof loginSchema>;
export type IRegisterFormValues = z.infer<typeof registerSchema>;
export type IRentalFormValues = z.infer<typeof rentalSchema>;
export type IGearFormValues = z.infer<typeof gearSchema>;
export type IReviewFormValues = z.infer<typeof reviewSchema>;
export type ICategoryFormValues = z.infer<typeof categorySchema>;
