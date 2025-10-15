import { BaseModel } from './base.model';
import { Listing } from './listing.model';

export class Image extends BaseModel {
  url: string;
  listingId?: string | undefined;

  // Relations
  listing?: Listing | undefined;

  constructor(
    id: string,
    url: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
    listingId?: string,
    listing?: Listing,
  ) {
    super(id, createdAt, updatedAt, isDeleted);
    this.url = url;
    this.listingId = listingId;
    this.listing = listing;
  }

  toJSON(): object {
    const base = super.toJSON();
    return {
      ...base,
      url: this.url,
      listingId: this.listingId,
    };
  }
}
