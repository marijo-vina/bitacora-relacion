import { User } from './user.model';

export interface Comment {
  id: number;
  content: string;
  author?: User;
  created_at: string;
  is_mine?: boolean;
}

export interface CreateCommentRequest {
  content: string;
}
