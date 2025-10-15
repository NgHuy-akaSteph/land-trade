import { BaseModel } from './base.model';
import { User } from './user.model';

export class Role extends BaseModel {
  name: string;

  // Relations
  users?: User[] | undefined;

  constructor(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
    users?: User[],
  ) {
    super(id, createdAt, updatedAt, isDeleted);
    this.name = name;
    this.users = users;
  }

  toJSON(): object {
    const base = super.toJSON();
    return {
      ...base,
      name: this.name,
    };
  }
}
