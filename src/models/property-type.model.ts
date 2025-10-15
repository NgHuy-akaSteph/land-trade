import { BaseModel } from './base.model';
import { Listing } from './listing.model';

export class PropertyType extends BaseModel {
  name: string;

  // Relations
  listings?: Listing[] | undefined;

  constructor(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
    listings?: Listing[],
  ) {
    super(id, createdAt, updatedAt, isDeleted);
    this.name = name;
    this.listings = listings;
  }

  toJSON(): object {
    const base = super.toJSON();
    return {
      ...base,
      name: this.name,
    };
  }
}
