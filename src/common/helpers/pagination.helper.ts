import { Injectable } from "@nestjs/common";
import { PaginationInput, PaginationOutput } from "@types";


@Injectable()
export class PaginationHelper {

  async paginate<T>(pagination: PaginationInput<T>): Promise<PaginationOutput> {
    const {
      model,
      page,
      limit,
      matchingQuery,
      selectFields,
      sortOptions,
      populate
    } = pagination;

    const skip = (page - 1) * limit;
    let query = model.find(matchingQuery)
      .sort({ createdAt: "desc" }).skip(skip).limit(limit);

    if (populate?.length) {
      populate.forEach((obj) => {
        query.populate({ ...obj });
      });
    }

    if (sortOptions) query.sort(sortOptions);

    if (selectFields) query = query.select(selectFields);

    const data = await query.exec();

    const total = await model.countDocuments(matchingQuery);
    const lastPage = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      lastPage
    };
  }

}
