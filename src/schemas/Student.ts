import { model, ObjectId, Schema } from 'mongoose';

export interface Student {
  name: string;
  shortName: string;
  code: string;
  stars: number;
  type: string;
  description: string;
  ments: {
    intro: string;
  };
  belong?: ObjectId;
  club?: ObjectId;
  grade: number;
  age: number | string;
  height: number;
  birth: string;
  hobby?: string;
  defaultStats: {
    health: number;
    attack: number;
    defense: number;
    healing: number;
    hit: number;
    dodge: number;
    critical: number;
    criticalResistance: number;
    criticalDamage: number;
    criticalDamageResistance: number;
    stability: number;
    range: number;
    crowdControlEnhancement: number;
    crowdControlResistance: number;
    recoveryEffectEnhancement: number;
  };
  illustrator?: string;
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
    code: {
      type: String,
      required: true
    },
    stars: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    ments: {
      intro: {
        type: String,
        required: true
      }
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
    defaultStats: {
      health: {
        type: Number,
        required: true
      },
      attack: {
        type: Number,
        required: true
      },
      defense: {
        type: Number,
        required: true
      },
      healing: {
        type: Number,
        required: true
      },
      hit: {
        type: Number,
        required: true
      },
      dodge: {
        type: Number,
        required: true
      },
      critical: {
        type: Number,
        required: true
      },
      criticalResistance: {
        type: Number,
        required: true
      },
      criticalDamage: {
        type: Number,
        required: true
      },
      criticalDamageResistance: {
        type: Number,
        required: true
      },
      stability: {
        type: Number,
        required: true
      },
      range: {
        type: Number,
        required: true
      },
      crowdControlEnhancement: {
        type: Number,
        required: true
      },
      crowdControlResistance: {
        type: Number,
        required: true
      },
      recoveryEffectEnhancement: {
        type: Number,
        required: true
      }
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
