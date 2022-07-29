import { model, ObjectId, Schema } from 'mongoose';

export interface Student {
  name: string;
  shortName: string;
  belong?: ObjectId;
  club?: ObjectId;
  grade: number;
  age: number | string;
  height: number;
  birth: string;
  hobby?: string;
  illustrator?: string;
  avatar?: string;
  voiceActor?: string;
}

export const StudentSchema = new Schema<Student>(
  {
    name: {
      type: String,
      required: true
    },
    shortName: {
      type: String,
      required: true
    },
    belong: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club'
    },
    grade: {
      type: Number,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    birth: {
      type: String,
      required: true
    },
    hobby: {
      type: String
    },
    illustrator: {
      type: String
    },
    voiceActor: {
      type: String
    }
  },
  { collection: 'students' }
);

export const StudentModel = model('Student', StudentSchema);

export default StudentModel;
