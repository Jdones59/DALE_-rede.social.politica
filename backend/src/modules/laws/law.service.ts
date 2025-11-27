import { Law } from './law.model';

export const getLaws = async (page: number, limit: number) => {
  return Law.find().skip((page - 1) * limit).limit(limit);
};

export const getLawById = async (id: string) => {
  return Law.findById(id);
};

export const updateLaw = async (id: string, data: any) => {
  return Law.findByIdAndUpdate(id, data, { new: true });
};

export const createOrUpdateLaw = async (data: any) => {
  const existing = await Law.findOne({ number: data.number });
  if (existing) {
    return updateLaw(existing._id.toString(), data);
  }
  const law = new Law(data);
  return law.save();
};