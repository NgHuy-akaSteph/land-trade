import { BaseModel } from './base.model';
import { User } from './user.model';
import { PropertyType } from './property-type.model';
import { Image } from './image.model';
import { Transaction } from './transaction.model';

export class Listing extends BaseModel {
  title: string;
  titleSearch?: string | undefined;
  address: string;
  price: number;
  description?: string | undefined;
  direction: string;
  frontage?: number | undefined;
  depth?: number | undefined;
  area: number;
  latitude?: number | undefined;
  longitude?: number | undefined;
  authorId: string;
  propTypesId: string;
  status?: string | undefined;

  // Relations
  author?: User | undefined;
  propTypes?: PropertyType | undefined;
  images?: Image[] | undefined;
  transactions?: Transaction[] | undefined;

  constructor(
    id: string,
    title: string,
    address: string,
    price: number,
    direction: string,
    area: number,
    authorId: string,
    propTypesId: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean = false,
    description?: string,
    frontage?: number,
    depth?: number,
    latitude?: number,
    longitude?: number,
    status?: string,
    titleSearch?: string,
    author?: User,
    propTypes?: PropertyType,
    images?: Image[],
    transactions?: Transaction[],
  ) {
    super(id, createdAt, updatedAt, isDeleted);
    this.title = title;
    this.titleSearch = titleSearch;
    this.address = address;
    this.price = price;
    this.direction = direction;
    this.area = area;
    this.authorId = authorId;
    this.propTypesId = propTypesId;
    this.description = description;
    this.frontage = frontage;
    this.depth = depth;
    this.latitude = latitude;
    this.longitude = longitude;
    this.status = status;
    this.author = author;
    this.propTypes = propTypes;
    this.images = images;
    this.transactions = transactions;
  }

  toJSON(): object {
    const base = super.toJSON();
    return {
      ...base,
      title: this.title,
      titleSearch: this.titleSearch,
      address: this.address,
      price: this.price,
      description: this.description,
      direction: this.direction,
      frontage: this.frontage,
      depth: this.depth,
      area: this.area,
      latitude: this.latitude,
      longitude: this.longitude,
      authorId: this.authorId,
      propTypesId: this.propTypesId,
      status: this.status,
    };
  }
}
