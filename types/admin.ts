export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface MenfessSubmission {
  id: string;
  template_id: string;
  message: string;
  sender_name?: string | null;
  image_url: string;
  status: SubmissionStatus;
  created_at: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
