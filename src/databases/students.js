"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const students = [
    {
        id: 'shiroko',
        name: '스나오오카미 시로코',
        shortName: '시로코',
        stars: 3,
        type: 'STRIKER',
        description: '스포츠를 좋아하는 아비도스 대책위원회의 행동반장.\n기본적으로 말수가 적고 표정 변화가 없어 차갑다는 인상을 주곤 하지만, 사실은 누구보다 아비도스 학원을 아끼는 소녀이다.\n학원의 부흥을 위해서는 수단과 방법을 가리지 않으며, 가끔 엉뚱한 발상을 내놓을 때도 있다.',
        ments: {
            intro: '어서 와. 선생님. 오늘도 잘 부탁해.'
        },
        belong: 'abydos',
        club: 'task_force',
        grade: 2,
        age: 16,
        height: 156,
        birth: '5/16',
        hobby: '조깅, 체력 트레이닝, 로드바이크',
        stats: {
            health1: 2225,
            health100: 22260,
            attack1: 278,
            attack100: 2788,
            defense1: 19,
            defense100: 118,
            healing1: 1414,
            healing100: 4244,
            hit: 707,
            dodge: 808,
            critical: 202,
            criticalResistance: 100,
            criticalDamage: 2,
            criticalDamageResistance: 0.5,
            stability: 1384,
            range: 650,
            crowdControlEnhancement: 100,
            crowdControlResistance: 100,
            recoveryEffectEnhancement: 1
        },
        compatibility: {
            primaryType: 'DEAL',
            position: 'MIDDLE',
            attackType: 'EXPLOSIVE',
            defenseType: 'LIGHT_ARMOR',
            terrains: {
                street: 'S',
                outdoor: 'B',
                indoor: 'D'
            }
        },
        skills: {
            ex: {
                name: '드론 소환: 화력 지원',
                cost: 2,
                description: '적 1인에게 공격력 ${damageRate} 대미지',
                variables: {
                    damageRate: ['400%', '460%', '580%', '640%', '760%']
                }
            },
            primary: {
                name: '수류탄 투척',
                description: '${interval}마다 원형범위 내의 적에게 공격력 ${damageRate} 대미지',
                variables: {
                    interval: [
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초'
                    ],
                    damageRate: [
                        '193%',
                        '203%',
                        '213%',
                        '251%',
                        '261%',
                        '271%',
                        '309%',
                        '319%',
                        '329%',
                        '368%'
                    ]
                }
            },
            reinforce: {
                name: '약점 노리기',
                description: '치명 수치 ${increaseRate} 증가',
                variables: {
                    increaseRate: [
                        '14%',
                        '14.7%',
                        '15.4%',
                        '18.2%',
                        '18.9%',
                        '19.6%',
                        '22.4%',
                        '23.1%',
                        '23.8%',
                        '26.6%'
                    ]
                }
            },
            sub: {
                name: '고속 연사',
                description: '일반 공격 시 ${percentage} 확률로 공격속도 ${increaseRate} 증가(${duration}간)(쿨타임 ${cooltime})',
                variables: {
                    percentage: [
                        '20%',
                        '20%',
                        '20%',
                        '20%',
                        '20%',
                        '20%',
                        '20%',
                        '20%',
                        '20%',
                        '20%'
                    ],
                    increaseRate: [
                        '30.2%',
                        '31.7%',
                        '33.2%',
                        '39.3%',
                        '40.8%',
                        '42.3%',
                        '48.3%',
                        '49.9%',
                        '51.4%',
                        '57.4%'
                    ],
                    duration: [
                        '30초',
                        '30초',
                        '30초',
                        '30초',
                        '30초',
                        '30초',
                        '30초',
                        '30초',
                        '30초',
                        '30초'
                    ],
                    cooltime: [
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초',
                        '25초'
                    ]
                }
            }
        },
        uniqueWeapon: {
            name: 'WHITE FANG 465',
            type: 'AR',
            description: '시로코가 애용하는 돌격소총.\n늘 꼼꼼하게 정비해 두기 때문에 어떤 상황에서도 준비만전이다.'
        },
        illustrator: '즉흥환상',
        voiceActor: '오구라 유이'
    }
];
exports.default = students;
