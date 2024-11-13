import { Repository } from 'typeorm';
import { Post } from './post.entity';

export class PostRepository extends Repository<Post> {}
