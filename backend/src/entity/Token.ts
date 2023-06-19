import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from "typeorm";
  import { User } from "./User";
  
  export enum TokenType {
    Verification = 'verification',
    ResetPassword = 'reset_password',
  }
  
  @Entity({ name: "tokens" })
  export class Token {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
    user!: User;
  
    @Column()
    token!: string;
  
    @Column({ type: 'enum', enum: TokenType })
    type!: TokenType;
  
    @Column({ type: 'timestamp' })
    expiration!: Date;
  
    @CreateDateColumn({name:"created_at"})
    createdAt!: Date;
  
    @UpdateDateColumn({name:"updated_at"})
    updatedAt!: Date;
  }