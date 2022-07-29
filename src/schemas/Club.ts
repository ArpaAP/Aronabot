import { model, ObjectId, Schema } from 'mongoose';

export interface Club {
  name: string;
  belong: ObjectId;
}

export const ClubSchema = new Schema<Club>(
  {
    name: {
      type: String,
      required: true
    },
    belong: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    }
  },
  { collection: 'clubs' }
);

const ClubModel = model('Club', ClubSchema);

export default ClubModel;
