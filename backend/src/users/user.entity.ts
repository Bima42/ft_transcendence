import { Entity } from 'typeorm';

@Entity()
export class User {
  userId: number;

  username: string;

  password: string;
}
