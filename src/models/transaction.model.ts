import { BaseModel } from './base.model';
import { Listing } from './listing.model';
import { User } from './user.model';

export class Transaction extends BaseModel {
  name: string;
  nameSearch?: string | undefined;
  listingId: string;
  customerId: string;
  sellerId: string;
  price: number;
  status: string;

  // Relations
  listing?: Listing | undefined;
  customer?: User | undefined;
  seller?: User | undefined;

  constructor(
    id: string,
    name: string,
    listingId: string,
    customerId: string,
    sellerId: string,
    price: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
    nameSearch?: string,
    listing?: Listing,
    customer?: User,
    seller?: User,
  ) {
    super(id, createdAt, updatedAt, isDeleted);
    this.name = name;
    this.nameSearch = nameSearch;
    this.listingId = listingId;
    this.customerId = customerId;
    this.sellerId = sellerId;
    this.price = price;
    this.status = status;
    this.listing = listing;
    this.customer = customer;
    this.seller = seller;
  }

  toJSON(): object {
    const base = super.toJSON();
    return {
      ...base,
      name: this.name,
      nameSearch: this.nameSearch,
      listingId: this.listingId,
      customerId: this.customerId,
      sellerId: this.sellerId,
      price: this.price,
      status: this.status,
    };
  }
}
