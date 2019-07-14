import { Category, getZMoveName, MoveData, MOVES, Recoil } from './data/moves';
import { Type } from './data/types';
import { extend } from './util';

export class Move {
  name: string;
  hits: number;
  usedTimes?: number;
  metronomeCount?: number;
  bp: number;
  type: Type;
  category: Category;
  hasSecondaryEffect: boolean;
  isSpread: boolean;
  makesContact: boolean;
  hasRecoil?: Recoil;
  isCrit: boolean;
  givesHealth: boolean;
  percentHealed?: number;
  ignoresBurn: boolean;
  isPunch: boolean;
  isBite: boolean;
  isBullet: boolean;
  isSound: boolean;
  isPulse: boolean;
  hasPriority: boolean;
  dropsStats?: number;
  ignoresDefenseBoosts: boolean;
  dealsPhysicalDamage: boolean;
  bypassesProtect: boolean;
  isZ: boolean;
  usesHighestAttackStat: boolean;

  constructor(
    gen: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    name: string,
    ability?: string,
    item?: string,
    useZ?: boolean,
    isCrit?: boolean,
    hits?: number,
    usedTimes?: number,
    metronomeCount?: number,
    overrides?: Partial<MoveData>
  ) {
    let data: MoveData & { name: string } = extend(true, { name }, MOVES[gen][name], overrides);
    // If isZMove but there isn't a corresponding z-move, use the original move
    if (useZ && 'zp' in data) {
      const zMoveName: string = getZMoveName(data.name, data.type, item)!;
      const zMove = MOVES[gen][zMoveName];
      data = extend(true, {}, zMove, {
        name: zMoveName,
        bp: zMove.bp === 1 ? data.zp : zMove.bp,
        category: data.category,
      });
      this.hits = 1;
    } else {
      this.hits = data.isMultiHit
        ? hits || (ability === 'Skill Link' || item === 'Grip Claw' ? 5 : 3)
        : data.isTwoHit
        ? 2
        : 1;
      this.usedTimes = (data.dropsStats && usedTimes) || 1;
      this.metronomeCount = metronomeCount;
    }

    this.name = data.name;
    this.bp = data.bp;
    this.type = data.type;
    this.category = data.category || 'Status';
    this.hasSecondaryEffect = !!data.hasSecondaryEffect;
    this.isSpread = !!data.isSpread;
    this.makesContact = !!data.makesContact;
    this.hasRecoil = data.hasRecoil;
    this.isCrit = !!isCrit || !!data.alwaysCrit;
    this.givesHealth = !!data.givesHealth;
    this.percentHealed = data.percentHealed;
    this.ignoresBurn = !!data.ignoresBurn;
    this.isPunch = !!data.isPunch;
    this.isBite = !!data.isBite;
    this.isBullet = !!data.isBullet;
    this.isSound = !!data.isSound;
    this.isPulse = !!data.isPulse;
    this.hasPriority = !!data.hasPriority;
    this.dropsStats = data.dropsStats;
    this.ignoresDefenseBoosts = !!data.ignoresDefenseBoosts;
    this.dealsPhysicalDamage = !!data.dealsPhysicalDamage;
    this.bypassesProtect = !!data.bypassesProtect;
    this.isZ = !!data.isZ;
    this.usesHighestAttackStat = !!data.usesHighestAttackStat;
  }
}
