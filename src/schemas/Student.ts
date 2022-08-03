interface Student {
  id: string;
  name: string;
  shortName: string;
  stars: number;
  type: string;
  description: string;
  ments: {
    intro: string;
  };
  belong?: string;
  club?: string;
  grade: number;
  age: number | string;
  height: number;
  birth: string;
  hobby?: string;
  stats: {
    health1: number;
    health100: number;
    attack1: number;
    attack100: number;
    defense1: number;
    defense100: number;
    healing1: number;
    healing100: number;
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
  favorStats: { [stat: string]: number[] };
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
      cost: number[];
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
  uniqueWeapon: {
    name: string;
    type: 'SG' | 'SMG' | 'AR' | 'GL' | 'HG' | 'SR' | 'RG' | 'MG' | 'MT';
    description: string;
  };
  illustrator?: string;
  voiceActor?: string;
}

export default Student;
