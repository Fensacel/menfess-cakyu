import { MenfessConfig } from './template';

export type SubmissionStatus = 'pending' | 'approved' | 'uploaded' | 'rejected';

export interface MenfessSubmission {
  id: string;
  code: string; // e.g. "MF-1042"
  createdAt: string; // ISO date
  config: MenfessConfig;
  status: SubmissionStatus;
  targetPlatform: 'instagram';
  caption: string;
  instagramUrl?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  uploaded: number;
  rejected: number;
}
