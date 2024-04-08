import { Logger } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery, SortValues } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    // if (!document) {
    //   this.logger.warn(
    //     `Document not found with query ${JSON.stringify(filterQuery)}`,
    //   );

    //   throw new NotFoundException('Document not found');
    // }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    // if (!document) {
    //   this.logger.warn(
    //     `Document not found with query ${JSON.stringify(filterQuery)}`,
    //   );

    //   throw new NotFoundException('Document not found');
    // }

    return document;
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    projection?: Record<keyof FilterQuery<TDocument>, 1 | 0>,
    sort: Record<string, SortValues> = {},
    skip: number = 0,
    limit: number = 0,
  ): Promise<TDocument[]> {
    return await this.model
      .find(filterQuery, projection || {})
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery);

    // if (!document) {
    //   this.logger.warn(
    //     `Document not found with query ${JSON.stringify(filterQuery)}`,
    //   );

    //   throw new NotFoundException('Document not found');
    // }

    return document;
  }
}
