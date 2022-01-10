import { Model } from "mongoose";
import { merge } from "lodash";

function createFactory<T>(factoryModel: Model<T>, defaultFields: Partial<T>) {
  return (overwriteFields?: typeof defaultFields) => {
    const document = new factoryModel(merge(defaultFields, overwriteFields));
    return document.save();
  };
}

export default createFactory;
