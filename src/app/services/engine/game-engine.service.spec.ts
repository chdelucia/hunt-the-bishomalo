import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';
import { CELL_CONTENTS, Chars, Direction, GameSettings } from '../../models';
import { GameStore } from 'src/app/store';
import { getTranslocoTestingModule } from 'src/app/utils';

import { BoardSetupService } from './board-setup.service';
import { PlayerActionService } from './player-action.service';
import { GameRulesService } from './game-rules.service';
import { LevelManagementService } from './level-management.service';

const mockBoardSetupService = {
  initializeGameBoard: jest.fn(),
};
const mockPlayerActionService = {
  moveForward: jest.fn(),
  turnLeft: jest.fn(),
  turnRight: jest.fn(),
  shootArrow: jest.fn(),
};
const mockGameRulesService = {
  checkCurrentCell: jest.fn(),
  getPerceptionMessage: jest.fn().mockReturnValue('Perception message'),
  handleWumpusHit: jest.fn(),
  handleMissedArrow: jest.fn(),
};
const mockLevelManagementService = {
  initGame: jest.fn(),
  nextLevel: jest.fn(),
  restartLevel: jest.fn(),
  newGame: jest.fn(),
  exitGame: jest.fn(),
  canExitWithVictory: jest.fn().mockReturnValue(false),
};

const mockStore = {
  hunter: jest.fn().mockReturnValue({ x: 0, y: 0, alive: true, hasWon: false, direction: Direction.RIGHT, arrows: 1 }),
  settings: jest.fn().mockReturnValue({ size: 4 }),
};

describe('GameEngineService Facade', () => {
  let service: GameEngineService;
  let levelManagementService: LevelManagementService;
  let playerActionService: PlayerActionService;
  let gameRulesService: GameRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        GameEngineService,
        { provide: GameStore, useValue: mockStore },
        { provide: BoardSetupService, useValue: mockBoardSetupService },
        { provide: PlayerActionService, useValue: mockPlayerActionService },
        { provide: GameRulesService, useValue: mockGameRulesService },
        { provide: LevelManagementService, useValue: mockLevelManagementService },
      ],
    });

    service = TestBed.inject(GameEngineService);
    levelManagementService = TestBed.inject(LevelManagementService);
    playerActionService = TestBed.inject(PlayerActionService);
    gameRulesService = TestBed.inject(GameRulesService);

    jest.clearAllMocks();
  });

  it('initGame should delegate to LevelManagementService and then GameRulesService', () => {
    const config = { size: 4 } as GameSettings;
    service.initGame(config);
    expect(levelManagementService.initGame).toHaveBeenCalledWith(config);
    expect(gameRulesService.checkCurrentCell).toHaveBeenCalledWith(0, 0);
  });

  it('moveForward should delegate to PlayerActionService and then GameRulesService if player is alive', () => {
    mockStore.hunter.mockReturnValue({ x: 0, y: 0, alive: true, hasWon: false, direction: Direction.RIGHT });
    service.moveForward();
    expect(playerActionService.moveForward).toHaveBeenCalled();
    expect(gameRulesService.checkCurrentCell).toHaveBeenCalledWith(0, 0);
  });
  
  it('moveForward should not call checkCurrentCell if player is not alive', () => {
    mockStore.hunter.mockReturnValue({ x: 0, y: 0, alive: false, hasWon: false, direction: Direction.RIGHT });
    service.moveForward();
    expect(playerActionService.moveForward).toHaveBeenCalled();
    expect(gameRulesService.checkCurrentCell).not.toHaveBeenCalled();
  });

  it('turnLeft should delegate to PlayerActionService', () => {
    service.turnLeft();
    expect(playerActionService.turnLeft).toHaveBeenCalled();
  });

  it('turnRight should delegate to PlayerActionService', () => {
    service.turnRight();
    expect(playerActionService.turnRight).toHaveBeenCalled();
  });

  it('shootArrow should delegate to PlayerActionService', () => {
    service.shootArrow();
    expect(playerActionService.shootArrow).toHaveBeenCalled();
  });

  it('exitGame should check canExitWithVictory and delegate to LevelManagementService if true', () => {
    (levelManagementService.canExitWithVictory as jest.Mock).mockReturnValue(true);
    service.exitGame();
    expect(levelManagementService.canExitWithVictory).toHaveBeenCalled();
    expect(levelManagementService.exitGame).toHaveBeenCalled();
  });

  it('exitGame should not delegate to LevelManagementService if canExitWithVictory is false', () => {
    (levelManagementService.canExitWithVictory as jest.Mock).mockReturnValue(false);
    service.exitGame();
    expect(levelManagementService.canExitWithVictory).toHaveBeenCalled();
    expect(levelManagementService.exitGame).not.toHaveBeenCalled();
  });
  
  it('newGame should delegate to LevelManagementService', () => {
    service.newGame();
    expect(levelManagementService.newGame).toHaveBeenCalled();
  });

  it('restartLevel should delegate to LevelManagementService and then GameRulesService', () => {
    service.restartLevel();
    expect(levelManagementService.restartLevel).toHaveBeenCalled();
    expect(gameRulesService.checkCurrentCell).toHaveBeenCalledWith(0,0);
  });

  it('nextLevel should delegate to LevelManagementService and then GameRulesService', () => {
    service.nextLevel();
    expect(levelManagementService.nextLevel).toHaveBeenCalled();
    expect(gameRulesService.checkCurrentCell).toHaveBeenCalledWith(0,0);
  });
  
  it('getPerceptionMessage should delegate to GameRulesService', () => {
    const message = service.getPerceptionMessage();
    expect(gameRulesService.getPerceptionMessage).toHaveBeenCalled();
    expect(message).toBe('Perception message');
  });
});
