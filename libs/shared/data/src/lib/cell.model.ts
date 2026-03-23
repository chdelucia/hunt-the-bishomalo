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
    alt: 'cellContent.wumpus.alt',
    ariaLabel: 'cellContent.wumpus.ariaLabel',
  },
  wumpusdefault: {
    type: 'wumpus',
    image: 'chars/default/wumpus.svg',
    alt: 'cellContent.wumpus.alt',
    ariaLabel: 'cellContent.wumpus.ariaLabel',
  },
  wumpuslara: {
    type: 'wumpus',
    image: 'chars/lara/wumpus.png',
    alt: 'cellContent.wumpus.alt',
    ariaLabel: 'cellContent.wumpus.ariaLabel',
  },
  wumpuslink: {
    type: 'wumpus',
    image: 'chars/link/wumpus.png',
    alt: 'cellContent.wumpus.alt',
    ariaLabel: 'cellContent.wumpus.ariaLabel',
  },
  wumpuslegolas: {
    type: 'wumpus',
    image: 'chars/legolas/wumpus.png',
    alt: 'cellContent.wumpus.alt',
    ariaLabel: 'cellContent.wumpus.ariaLabel',
  },
  gold: {
    type: 'gold',
    image: 'boardicons/gold.svg',
    alt: 'cellContent.gold.alt',
    ariaLabel: 'cellContent.gold.ariaLabel',
  },
  pit: {
    type: 'pit',
    image: 'boardicons/pit.svg',
    alt: 'cellContent.pit.alt',
    ariaLabel: 'cellContent.pit.ariaLabel',
  },
  arrow: {
    type: 'arrow',
    image: 'boardicons/arrow.svg',
    alt: 'cellContent.arrow.alt',
    ariaLabel: 'cellContent.arrow.ariaLabel',
  },
  heart: {
    type: 'heart',
    image: 'boardicons/heart.svg',
    alt: 'cellContent.heart.alt',
    ariaLabel: 'cellContent.heart.ariaLabel',
  },
  extrawumpus: {
    type: 'wumpus',
    image: 'boardicons/question.png',
    alt: 'cellContent.wumpus.alt',
    ariaLabel: 'cellContent.wumpus.ariaLabel',
  },
  extragold: {
    type: 'gold',
    image: 'boardicons/question.png',
    alt: 'cellContent.secret.alt',
    ariaLabel: 'cellContent.secret.ariaLabel',
  },
  extraheart: {
    type: 'heart',
    image: 'boardicons/question.png',
    alt: 'cellContent.secret.alt',
    ariaLabel: 'cellContent.secret.ariaLabel',
  },
  extraarrow: {
    type: 'arrow',
    image: 'boardicons/question.png',
    alt: 'cellContent.secret.alt',
    ariaLabel: 'cellContent.secret.ariaLabel',
  },
  dragonball: {
    type: 'dragonball',
    image: 'boardicons/b4.png',
    alt: 'cellContent.dragonball.alt',
    ariaLabel: 'cellContent.dragonball.ariaLabel',
  },
};
