import { Cell, GameEventEffectType, GameItem } from '../../models';

type CauseOfDeath = 'pit' | 'wumpus';

export type EffectsContext = {
  hasItem: (name: string) => boolean;
  handleRewind: (prev?: { x: number; y: number }) => void;
  handleShield: (prev?: { x: number; y: number }) => void;
  handlePickupArrow: (cell: Cell) => void;
  handlePitDeath: () => void;
  handleWumpusDeath: () => void;
  handleDragonball: (cell: Cell) => void;
  extraHeart: (cell: Cell) => void;
  extraGold: (cell: Cell) => void;
  removeFirstItemByEffect: (name: string) => GameItem[];
};
export function createGameEventEffects(ctx: EffectsContext): Array<{
  type: GameEventEffectType;
  itemName: string;
  apply: (cell: Cell, prev?: { x: number; y: number }) => void;
  canApply: (cause?: CauseOfDeath) => boolean;
  message: string;
}> {
  // Helper to create simple effects from a declarative descriptor.
  type SimpleHandlerName = 'handlePickupArrow' | 'extraHeart' | 'extraGold' | 'handleDragonball';

  type SimpleEffectDescriptor = {
    type: GameEventEffectType;
    itemName: string;
    effectName: string; // name to check in inventory
    handler: SimpleHandlerName;
    message: string;
  };

  function createSimpleEffect(desc: SimpleEffectDescriptor, c: EffectsContext) {
    return [
      {
        type: desc.type,
        itemName: desc.itemName,
        canApply: () => c.hasItem(desc.effectName),
        apply: (cell: Cell) => {
          // call the handler declared in descriptor
          // (we assert handler exists on context)
          (c as unknown as Record<string, (cell: Cell) => void>)[desc.handler](cell);
        },
        message: desc.message,
      },
    ];
  }

  return [
    {
      type: 'rewind',
      itemName: 'rebobinar',
      canApply: (cause?: CauseOfDeath) => cause === 'pit' && ctx.hasItem('rewind'),
      apply: (_cell: Cell, prev?: { x: number; y: number }) => ctx.handleRewind(prev),
      message: '¡Rebobinaste el tiempo y volviste a tu posición anterior!',
    },
    {
      type: 'shield',
      itemName: 'escudo',
      canApply: (cause?: CauseOfDeath) => cause === 'wumpus' && ctx.hasItem('shield'),
      apply: (_cell: Cell, prev?: { x: number; y: number }) => ctx.handleShield(prev),
      message: '¡Tu escudo bloqueó al Wumpus! pero se rompió.',
    },
    // Simple declarative effects - use descriptor to reduce repetition
    ...createSimpleEffect(
      {
        type: 'arrow',
        itemName: 'flecha-extra',
        effectName: 'flecha-extra',
        handler: 'handlePickupArrow',
        message: 'Has recogido una flecha.',
      },
      ctx,
    ),
    ...createSimpleEffect(
      {
        type: 'heart',
        itemName: 'extra-heart',
        effectName: 'extra-heart',
        handler: 'extraHeart',
        message: 'Has conseguido una vida extra.',
      },
      ctx,
    ),
    ...createSimpleEffect(
      {
        type: 'gold',
        itemName: 'extra-goldem',
        effectName: 'extra-goldem',
        handler: 'extraGold',
        message: 'Has recogido el oro, puedes escapar.',
      },
      ctx,
    ),
    {
      type: 'pit',
      itemName: 'die-pit',
      canApply: () => ctx.hasItem('extra-die'),
      apply: () => ctx.handlePitDeath(),
      message: '¡Caíste en un pozo!',
    },
    {
      type: 'wumpus',
      itemName: 'die-wumpus',
      canApply: () => ctx.hasItem('extra-wumpus'),
      apply: () => ctx.handleWumpusDeath(),
      message: '¡El Wumpus te devoró!',
    },
    {
      type: 'dragonball',
      itemName: 'dragonball',
      canApply: () => ctx.hasItem('dragonballs'),
      apply: (cell: Cell) => ctx.handleDragonball(cell),
      message: '¡Conseguiste una bola de drac con 4 estrellas!',
    },
  ];
}
