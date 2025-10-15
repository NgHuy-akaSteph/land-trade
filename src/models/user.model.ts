import { BaseModel } from './base.model';
import { Role } from './role.model';
import { Image } from './image.model';
import { Listing } from './listing.model';
import { Transaction } from './transaction.model';
import { Message } from './message.model';

export class User extends BaseModel {
  email: string;
  fullName: string;
  nameSearch?: string | undefined;
  password: string;
  roleId: string;
  phone: string;
  avatarId?: string | undefined;

  // Relations
  role?: Role | undefined;
  avatar?: Image | undefined;
  listings?: Listing[] | undefined;
  customerTransactions?: Transaction[] | undefined;
  sellerTransactions?: Transaction[] | undefined;
  sentMessages?: Message[] | undefined;
  receivedMessages?: Message[] | undefined;

  constructor(
    id: string,
    email: string,
    fullName: string,
    nameSearch: string | undefined,
    password: string,
    roleId: string,
    phone: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
    avatarId?: string,
    role?: Role,
    avatar?: Image,
    listings?: Listing[],
    customerTransactions?: Transaction[],
    sellerTransactions?: Transaction[],
    sentMessages?: Message[],
    receivedMessages?: Message[],
  ) {
    super(id, createdAt, updatedAt, isDeleted);
    this.email = email;
    this.fullName = fullName;
    this.nameSearch = nameSearch;
    this.password = password;
    this.roleId = roleId;
    this.phone = phone;
    this.avatarId = avatarId;
    this.role = role;
    this.avatar = avatar;
    this.listings = listings;
    this.customerTransactions = customerTransactions;
    this.sellerTransactions = sellerTransactions;
    this.sentMessages = sentMessages;
    this.receivedMessages = receivedMessages;
  }

  toJSON(): object {
    const base = super.toJSON();
    return {
      ...base,
      email: this.email,
      fullName: this.fullName,
      nameSearch: this.nameSearch,
      roleId: this.roleId,
      phone: this.phone,
      avatarId: this.avatarId,
      avatarUrl: this.avatar?.url || null,
    };
  }
}
