export type CellContentType = 'wumpus' | 'gold' | 'pit' | 'arrow' | 'heart' | 'extragold' | 'extraheart' | 'extrawumpus';

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

export const CELL_CONTENTS: Record<CellContentType, CellContent> = {
  wumpus: {
    type: 'wumpus',
    image: 'wumpus.svg',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  gold: {
    type: 'gold',
    image: 'gold.svg',
    alt: 'gold coin',
    ariaLabel: 'gold',
  },
  pit: {
    type: 'pit',
    image: 'pit.svg',
    alt: 'pit',
    ariaLabel: 'pit',
  },
  arrow: {
    type: 'arrow',
    image: 'arrow.svg',
    alt: 'arrow',
    ariaLabel: 'arrow',
  },
  heart: {
    type: 'heart',
    image: 'heart.svg',
    alt: 'extra life',
    ariaLabel: 'heart',
  },
  extrawumpus: {
    type: 'wumpus',
    image: 'question.png',
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  extragold: {
    type: 'gold',
    image: 'question.png',
    alt: 'secret',
    ariaLabel: 'secret',
  },
  extraheart: {
    type: 'heart',
    image: 'question.png',
    alt: 'secret',
    ariaLabel: 'secret',
  }
};
