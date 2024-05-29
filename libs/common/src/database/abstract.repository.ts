import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<TDocument extends AbstractDocument>  {
        protected abstract readonly logger: Logger
       constructor(protected readonly model: Model<TDocument>) {

        }


        async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
            this.logger.debug(`Creating a new document`);
            const createdDocument = new this.model({
                ...document,
                _id: new Types.ObjectId(),
            });
            return (await createdDocument.save()).toJSON() as unknown as TDocument;
        }


        async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {

            const document = await this.model.findOne(filterQuery).lean<TDocument>(true); // lean(true) returns a plain JS object instead of a Mongoose document

            if(!document){
                this.logger.warn(`document not found with filter ${JSON.stringify(filterQuery)}`)
                throw new NotFoundException(`document not found with filter ${JSON.stringify(filterQuery)}`)
            }
            return document as TDocument;

        }


        async findOneAndUpdate(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
            const document = await this.model.findOneAndUpdate(filterQuery, update, {
                new: true,
            
            }).lean<TDocument>(true);

            if(!document){
                this.logger.warn(`document not found with filter ${JSON.stringify(filterQuery)}`)
                throw new NotFoundException(`document not found with filter ${JSON.stringify(filterQuery)}`)
            }
            return document as TDocument;
        }

        async find(FilterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
            return this.model.find(FilterQuery).lean<TDocument[]>(true);
        }


        async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
           return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
        }
}