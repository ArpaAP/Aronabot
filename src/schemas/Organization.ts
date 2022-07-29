import { model, ObjectId, Schema } from 'mongoose';

export interface Organization {
  name: string;
  englishName: string;
}

export const OrganizationSchema = new Schema<Organization>(
  {
    name: {
      type: String,
      required: true
    },
    englishName: {
      type: String,
      required: true
    }
  },
  { collection: 'organizations' }
);

const OrganizationModel = model('Organization', OrganizationSchema);

export default OrganizationModel;
