import { Types, model, Document } from "mongoose";

export const validateRef = (ref: string) => {
  return async (refId: Types.ObjectId): Promise<Boolean> => {
    const refModel = model(ref);
    return Boolean(await refModel.findById(refId));
  };
};

export type ModelDocument<T> = Document<{}, {}, T> &
  T & { _id: Types.ObjectId };
