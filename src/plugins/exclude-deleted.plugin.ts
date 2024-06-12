import * as mongoose from "mongoose";
import { NextFunction } from "express";


export const excludeDeletedPlugin = (schema: mongoose.Schema) => {
  schema.pre(/^(find|count)/, function(this: mongoose.Query<any, any>, next: NextFunction) {
    this.where({ isDeleted: { $ne: true } });
    next();
  });

  // Pre-hook for aggregate operations to exclude deleted documents
  schema.pre("aggregate", function(next: NextFunction) {
    const pipeline = this.pipeline();

    // Add a $match stage to exclude deleted documents if it hasn't been added already
    if (!pipeline.some(stage => (stage as { $match?: any }).$match?.isDeleted !== undefined)) {
      this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    }
    next();
  });
};


