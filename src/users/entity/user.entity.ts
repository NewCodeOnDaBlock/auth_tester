import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Property({ nullable: true })
  refreshToken?: string;

  @Property({ default: false })
  emailVerified: boolean;

  @Property({ nullable: true })
  verificationCode?: string;

  @Property({ nullable: true })
  emailverificationToken?: string;

  @Property({ nullable: true })
  verificationCodeExpires?: Date;

  @Property({ type: 'date' })
  created_at: Date = new Date();

  @Property({ type: 'date' })
  updated_at: Date = new Date();
}
