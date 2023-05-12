import { Request } from "express";
import { Model, Query } from "mongoose";

export class Pagination {
  limit: number;
  skip: number;
  previousUrl: string;
  nextUrl: string | null = null;
  baseUrl: string;

  constructor(req: Request) {
    const { limit, skip } = req.query;
    const url = `http://localhost:3000${req.baseUrl}`;
    this.limit = limit ? Number(limit) : 3;
    this.skip = skip ? Number(skip) : 0;
    this.previousUrl = `${url}?limit=${this.limit}&skip=${this.skip}`;
    this.baseUrl = url;
  }

  private async query<T extends object>(model: Model<T>, filter?: any) {
    const filterQuery = filter ?? {};
    return await model
      .find(filterQuery)
      .sort({ createdAt: "descending" })
      .skip(this.skip)
      .limit(this.limit + 1);
  }
  public async findItemsWithPagination<T extends object>(
    model: Model<T>,
    filter?: any
  ) {
    const result = await this.query(model, filter);
    const nextSkip =
      result.length > this.limit ? this.skip + this.limit : this.skip;
    this.nextUrl = `${this.baseUrl}?limit=${this.limit}&skip=${nextSkip}`;
    if (result.length > this.limit) {
      result.pop();
    }
    return {
      data: result,
      previousUrl: this.previousUrl,
      nextUrl: this.nextUrl,
    };
  }
}
