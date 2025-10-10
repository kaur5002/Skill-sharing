// lib/schemas/dashboard.schema.ts
import { z } from 'zod';

export const TutorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  expertise: z.array(z.string()),
  rating: z.number().min(0).max(5).optional().default(0),
});

export const ScheduleItemSchema = z.object({
  id: z.string(),
  tutorId: z.string(),
  tutorName: z.string(),
  title: z.string(),
  startTime: z.string(), // ISO string
  endTime: z.string(),
  status: z.enum(['upcoming', 'completed', 'cancelled']),
  meetingUrl: z.string().url().optional(),
});

export const MessageSchema = z.object({
  id: z.string(),
  fromId: z.string(),
  toId: z.string(),
  sentAt: z.string(),
  text: z.string().min(1),
  read: z.boolean().default(false),
});

export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'paid', 'failed']),
  createdAt: z.string(),
  sessionId: z.string().optional(),
  tutorName: z.string(),
});

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  unlockedAt: z.string(),
  icon: z.string().optional(),
});

export const SessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  tutorName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  meetingUrl: z.string().url().optional(),
  status: z.enum(['upcoming', 'live', 'completed']),
});

export const DashboardSummarySchema = z.object({
  nextSessionAt: z.string().nullable(),
  unreadMessages: z.number().int().nonnegative(),
  totalHours: z.number().nonnegative(),
  achievementsCount: z.number().int().nonnegative(),
});

export const DashboardDataSchema = z.object({
  summary: DashboardSummarySchema,
  schedule: z.array(ScheduleItemSchema),
  messages: z.array(MessageSchema),
  payments: z.array(PaymentSchema),
  achievements: z.array(AchievementSchema),
  sessions: z.array(SessionSchema),
  tutors: z.array(TutorSchema),
});

export type Tutor = z.infer<typeof TutorSchema>;
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;

// Tutor
export const TutorSummarySchema = z.object({
  nextSessionAt: z.string().nullable(),
  unreadMessages: z.number().int().nonnegative(),
  totalTeachingHours: z.number().nonnegative(),
  totalEarnings: z.number().nonnegative(),
  studentsCount: z.number().int().nonnegative(),
});
export type TutorSummary = z.infer<typeof TutorSummarySchema>;
