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

import { ASSETS_BASE_URL } from './constants';

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
    image: `${ASSETS_BASE_URL}/chars/link/wumpu.png`,
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpusdefault: {
    type: 'wumpus',
    image: `${ASSETS_BASE_URL}/chars/default/wumpus.svg`,
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpuslara: {
    type: 'wumpus',
    image: `${ASSETS_BASE_URL}/chars/lara/wumpus.png`,
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpuslink: {
    type: 'wumpus',
    image: `${ASSETS_BASE_URL}/chars/link/wumpus.png`,
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  wumpuslegolas: {
    type: 'wumpus',
    image: `${ASSETS_BASE_URL}/chars/legolas/wumpus.png`,
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  gold: {
    type: 'gold',
    image: `${ASSETS_BASE_URL}/boardicons/gold.svg`,
    alt: 'gold coin',
    ariaLabel: 'gold',
  },
  pit: {
    type: 'pit',
    image: `${ASSETS_BASE_URL}/boardicons/pit.svg`,
    alt: 'pit',
    ariaLabel: 'pit',
  },
  arrow: {
    type: 'arrow',
    image: `${ASSETS_BASE_URL}/boardicons/arrow.svg`,
    alt: 'arrow',
    ariaLabel: 'arrow',
  },
  heart: {
    type: 'heart',
    image: `${ASSETS_BASE_URL}/boardicons/heart.svg`,
    alt: 'extra life',
    ariaLabel: 'heart',
  },
  extrawumpus: {
    type: 'wumpus',
    image: `${ASSETS_BASE_URL}/boardicons/question.png`,
    alt: 'wumpus',
    ariaLabel: 'wumpus',
  },
  extragold: {
    type: 'gold',
    image: `${ASSETS_BASE_URL}/boardicons/question.png`,
    alt: 'secret',
    ariaLabel: 'secret',
  },
  extraheart: {
    type: 'heart',
    image: `${ASSETS_BASE_URL}/boardicons/question.png`,
    alt: 'secret',
    ariaLabel: 'secret',
  },
  extraarrow: {
    type: 'arrow',
    image: `${ASSETS_BASE_URL}/boardicons/question.png`,
    alt: 'secret',
    ariaLabel: 'secret',
  },
  dragonball: {
    type: 'dragonball',
    image: `${ASSETS_BASE_URL}/boardicons/b4.png`,
    alt: 'dragonball',
    ariaLabel: 'dragonball',
  },
};
