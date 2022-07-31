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
  compatibility: {
    primaryType: 'TANK' | 'DEAL' | 'HEAL' | 'SUPPORT';
    position: 'FRONT' | 'MIDDLE' | 'BACK';
    attackType: 'EXPLOSIVE' | 'PENETRATING' | 'MYSTERY';
    defenseType: 'LIGHT_ARMOR' | 'HEAVY_ARMOR' | 'SPECIAL_ARMOR';
    terrains: {
      street: 'S' | 'A' | 'B' | 'C' | 'D';
      outdoor: 'S' | 'A' | 'B' | 'C' | 'D';
      indoor: 'S' | 'A' | 'B' | 'C' | 'D';
    };
  };
  skills: {
    ex: {
      name: string;
      cost: number;
      description: string;
      variables: { [key: string]: string[] };
    };
    primary: {
      name: string;
      description: string;
      variables: { [key: string]: string[] };
    };
    reinforce: {
      name: string;
      description: string;
      variables: { [key: string]: string[] };
    };
    sub: {
      name: string;
      description: string;
      variables: { [key: string]: string[] };
    };
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
    compatibility: {
      primaryType: {
        type: String,
        required: true
      },
      position: {
        type: String,
        required: true
      },
      attackType: {
        type: String,
        required: true
      },
      defenseType: {
        type: String,
        required: true
      },
      terrains: {
        street: {
          type: String,
          required: true
        },
        outdoor: {
          type: String,
          required: true
        },
        indoor: {
          type: String,
          required: true
        }
      }
    },
    skills: {
      ex: {
        name: {
          type: String,
          required: true
        },
        cost: {
          type: Number,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        variables: {
          type: Schema.Types.Mixed,
          required: true
        }
      },
      primary: {
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        variables: {
          type: Schema.Types.Mixed,
          required: true
        }
      },
      reinforce: {
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        variables: {
          type: Schema.Types.Mixed,
          required: true
        }
      },
      sub: {
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        variables: {
          type: Schema.Types.Mixed,
          required: true
        }
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
