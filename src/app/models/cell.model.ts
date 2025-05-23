export type CellContentType =
  | 'wumpus'
  | 'wumpuslara'
  | 'wumpuslink'
  | 'wumpuslegolas'
  | 'wumpusdefault'
  | 'gold'
  | 'pit'
  | 'arrow'
  | 'heart'
  | 'extragold'
  | 'extraheart'
  | 'extrawumpus'
  | 'extraarrow'
  | 'dragonball';

export interface CellContent {
  type: CellContentType;
  image: string;
  alt: string;
  ariaLabel: string;
}

export interface Cell {
  x: number;
  y: number;
  visited?: boolean;
  content?: CellContent;
}

export type CharacterType = 'default' | 'link' | 'lara' | 'legolas';

export const CELL_CONTENTS: Record<CellContentType, CellContent> = {
  wumpus: {
    type: 'wumpus',
    image: 'chars/link/wumpu.png',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpusdefault: {
    type: 'wumpus',
    image: 'chars/default/wumpus.svg',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpuslara: {
    type: 'wumpus',
    image: 'chars/lara/wumpus.png',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpuslink: {
    type: 'wumpus',
    image: 'chars/link/wumpus.png',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpuslegolas: {
    type: 'wumpus',
    image: 'chars/legolas/wumpus.png',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  gold: {
    type: 'gold',
    image: 'boardicons/gold.svg',
    alt: 'gold coin',
    ariaLabel: 'gold',
  },
  pit: {
    type: 'pit',
    image: 'boardicons/pit.svg',
    alt: 'pit',
    ariaLabel: 'pit',
  },
  arrow: {
    type: 'arrow',
    image: 'boardicons/arrow.svg',
    alt: 'arrow',
    ariaLabel: 'arrow',
  },
  heart: {
    type: 'heart',
    image: 'boardicons/heart.svg',
    alt: 'extra life',
    ariaLabel: 'heart',
  },
  extrawumpus: {
    type: 'wumpus',
    image: 'boardicons/question.png',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  extragold: {
    type: 'gold',
    image: 'boardicons/question.png',
    alt: 'secret',
    ariaLabel: 'secret',
  },
  extraheart: {
    type: 'heart',
    image: 'boardicons/question.png',
    alt: 'secret',
    ariaLabel: 'secret',
  },
  extraarrow: {
    type: 'arrow',
    image: 'boardicons/question.png',
    alt: 'secret',
    ariaLabel: 'secret',
  },
  dragonball: {
    type: 'dragonball',
    image: 'boardicons/b7.png',
    alt: 'dragonball',
    ariaLabel: 'dragonball',
  }

};
