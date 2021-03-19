
import {Comment} from './comment.model';

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
  img : File;
  likes: { type: number };
  dislikes: { type: number };
  comments: Comment[];

}
