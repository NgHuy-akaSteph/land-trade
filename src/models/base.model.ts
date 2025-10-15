export abstract class BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }

  toJSON(): object {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };
  }
}
