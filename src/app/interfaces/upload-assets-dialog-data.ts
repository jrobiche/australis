import { AuroraGameData } from './aurora';
import { GameConsole } from '../classes/game-console';

export interface UploadAssetsDialogData {
  gameConsole: GameConsole;
  gameData: AuroraGameData;
}
