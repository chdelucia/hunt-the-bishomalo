import { appConfig } from './app.config';
import {
  GAME_STORE_TOKEN,
  GAME_SOUND_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { ACHIEVEMENT_SERVICE, ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';

describe('appConfig', () => {
  it('should have all expected providers', () => {
    const providers = appConfig.providers;
    const providedTokens = providers.map((p: any) => p.provide || p);

    expect(providedTokens).toContain(GAME_STORE_TOKEN);
    expect(providedTokens).toContain(GAME_SOUND_TOKEN);
    expect(providedTokens).toContain(LOCALSTORAGE_SERVICE_TOKEN);
    expect(providedTokens).toContain(ANALYTICS_SERVICE_TOKEN);
    expect(providedTokens).toContain(GAME_EVENT_SERVICE_TOKEN);
    expect(providedTokens).toContain(ACHIEVEMENTS_LIST_TOKEN);
    expect(providedTokens).toContain(ACHIEVEMENT_SERVICE);
    expect(providedTokens).toContain(LEADERBOARD_SERVICE);
    expect(providedTokens).toContain(GAME_ENGINE_TOKEN);
  });
});
