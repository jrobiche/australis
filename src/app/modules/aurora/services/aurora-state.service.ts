import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import { AuroraFtpService } from './aurora-ftp.service';
import { AuroraGameService } from './aurora-game.service';
import { AuroraHttpService } from './aurora-http.service';
import {
  AuroraAchievement,
  AuroraAchievementPlayer,
  AuroraDashlaunch,
  AuroraFilebrowserEntry,
  AuroraGameData,
  AuroraMemory,
  AuroraMultidisc,
  AuroraPlugin,
  AuroraProfile,
  AuroraScreencaptureMeta,
  AuroraScreencaptureMetaListCount,
  AuroraSmc,
  AuroraSystem,
  AuroraSystemlink,
  AuroraSystemlinkBandwidth,
  AuroraTemperature,
  AuroraThread,
  AuroraThreadState,
  AuroraTitle,
  AuroraUpdateNotification,
  AuroraState,
} from '../types/aurora';

@Injectable({
  providedIn: 'root',
})
export class AuroraStateService {
  readonly ftp = inject(AuroraFtpService);
  readonly game = inject(AuroraGameService);
  readonly http = inject(AuroraHttpService);
  #authenticationTokens: Map<string, WritableSignal<string | null>>;
  #states: Map<string, AuroraState>;

  constructor() {
    this.#authenticationTokens = new Map<
      string,
      WritableSignal<string | null>
    >();
    this.#states = new Map<string, AuroraState>();
  }

  ////////////////////////////////////////////////////////////////////////////////
  // properties - contain the latest value loaded from the console
  //   the value of these properties are updated by the "load functions" below
  ////////////////////////////////////////////////////////////////////////////////
  activeTitle(
    configuration: GameConsoleConfiguration,
  ): Signal<AuroraTitle | null> {
    return computed(this.#gameConsoleData(configuration).activeTitle);
  }

  activeTitleAchievements(
    configuration: GameConsoleConfiguration,
  ): Signal<AuroraAchievement[]> {
    return computed(
      this.#gameConsoleData(configuration).activeTitleAchievements,
    );
  }

  activeTitleScreencaptureMetas(
    configuration: GameConsoleConfiguration,
  ): Signal<AuroraScreencaptureMeta[]> {
    return computed(
      this.#gameConsoleData(configuration).activeTitleScreencaptureMetas,
    );
  }

  activeTitleScreencaptureMetasSorted(
    configuration: GameConsoleConfiguration,
  ): Signal<AuroraScreencaptureMeta[]> {
    return computed(() =>
      this.activeTitleScreencaptureMetas(configuration)().sort(
        this.compareConsoleScreencaptureMetas,
      ),
    );
  }

  // TODO move somewhere else
  compareConsoleScreencaptureMetas(
    a: AuroraScreencaptureMeta,
    b: AuroraScreencaptureMeta,
  ) {
    // sort by timestamp from newest to oldest
    const timestampA = a.timestamp.toUpperCase();
    const timestampB = b.timestamp.toUpperCase();
    if (timestampA < timestampB) {
      return 1;
    }
    if (timestampA > timestampB) {
      return -1;
    }
    return 0;
  }

  dashlaunch(
    configuration: GameConsoleConfiguration,
  ): Signal<AuroraDashlaunch | null> {
    return computed(this.#gameConsoleData(configuration).dashlaunch);
  }

  memory(configuration: GameConsoleConfiguration): Signal<AuroraMemory | null> {
    return computed(this.#gameConsoleData(configuration).memory);
  }

  plugin(configuration: GameConsoleConfiguration): Signal<AuroraPlugin | null> {
    return computed(this.#gameConsoleData(configuration).plugin);
  }

  profileImageUrls(
    configuration: GameConsoleConfiguration,
  ): Signal<[string, string, string, string]> {
    return computed(this.#gameConsoleData(configuration).profileImageUrls);
  }

  profiles(
    configuration: GameConsoleConfiguration,
  ): Signal<(AuroraProfile | null)[]> {
    return computed(this.#gameConsoleData(configuration).profiles);
  }

  smc(configuration: GameConsoleConfiguration): Signal<AuroraSmc | null> {
    return computed(this.#gameConsoleData(configuration).smc);
  }

  system(configuration: GameConsoleConfiguration): Signal<AuroraSystem | null> {
    return computed(this.#gameConsoleData(configuration).system);
  }

  temperature(
    configuration: GameConsoleConfiguration,
  ): Signal<AuroraTemperature | null> {
    return computed(this.#gameConsoleData(configuration).temperature);
  }

  threadState(
    configuration: GameConsoleConfiguration,
  ): Signal<AuroraThreadState | null> {
    return computed(this.#gameConsoleData(configuration).threadState);
  }

  threads(configuration: GameConsoleConfiguration): Signal<AuroraThread[]> {
    return computed(this.#gameConsoleData(configuration).threads);
  }

  // TODO change `load` to something else? maybe `update` or `fetch`?
  ////////////////////////////////////////////////////////////////////////////////
  // load functions - functions that will retrieve values from console
  ////////////////////////////////////////////////////////////////////////////////
  loadActiveTitle(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraTitle> {
    return this.http
      .getTitle(configuration, this.#authenticationToken(configuration)())
      .then((activeTitle) => {
        this.#gameConsoleData(configuration).activeTitle.update(
          (value) => activeTitle,
        );
        return Promise.resolve(activeTitle);
      });
  }

  loadActiveTitleAchievements(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraAchievement[]> {
    return this.http
      .getAchievement(configuration, this.#authenticationToken(configuration)())
      .then((activeTitleAchievements) => {
        this.#gameConsoleData(configuration).activeTitleAchievements.update(
          (value) => activeTitleAchievements,
        );
        return Promise.resolve(activeTitleAchievements);
      })
      .catch((error) => {
        this.#gameConsoleData(configuration).activeTitleAchievements.update(
          (value) => [],
        );
        return Promise.reject(error);
      });
  }

  loadActiveTitleScreencaptureMetas(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraScreencaptureMeta[]> {
    return this.http
      .getScreencaptureMetaList(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((activeTitleScreencaptureMetas) => {
        this.#gameConsoleData(
          configuration,
        ).activeTitleScreencaptureMetas.update(
          (value) => activeTitleScreencaptureMetas,
        );
        return Promise.resolve(activeTitleScreencaptureMetas);
      });
  }

  loadDashlaunch(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraDashlaunch> {
    return this.http
      .getDashlaunch(configuration, this.#authenticationToken(configuration)())
      .then((dashlaunch) => {
        this.#gameConsoleData(configuration).dashlaunch.update(
          (value) => dashlaunch,
        );
        return Promise.resolve(dashlaunch);
      });
  }

  loadMemory(configuration: GameConsoleConfiguration): Promise<AuroraMemory> {
    return this.http
      .getMemory(configuration, this.#authenticationToken(configuration)())
      .then((memory) => {
        this.#gameConsoleData(configuration).memory.update((value) => memory);
        return Promise.resolve(memory);
      });
  }

  loadPlugin(configuration: GameConsoleConfiguration): Promise<AuroraPlugin> {
    return this.http
      .getPlugin(configuration, this.#authenticationToken(configuration)())
      .then((plugin) => {
        this.#gameConsoleData(configuration).plugin.update((value) => plugin);
        return Promise.resolve(plugin);
      });
  }

  loadProfileImageUrl(
    configuration: GameConsoleConfiguration,
    index: number,
  ): Promise<string> {
    // set profile image as empty string if profile is not valid or logged in
    let profile = this.#gameConsoleData(configuration).profiles()[index];
    if (profile == null || profile.signedin != 1) {
      let imageUrls = this.#gameConsoleData(configuration).profileImageUrls();
      imageUrls[index] = '';
      this.#gameConsoleData(configuration).profileImageUrls.update(
        (value) => imageUrls,
      );
      return Promise.resolve(imageUrls[index]);
    }
    return this.http
      .getImageProfileUrl(
        configuration,
        this.#authenticationToken(configuration)(),
        index,
      )
      .then((imageUrl) => {
        let imageUrls = this.#gameConsoleData(configuration).profileImageUrls();
        if (imageUrls[index] != imageUrl) {
          imageUrls[index] = imageUrl;
          this.#gameConsoleData(configuration).profileImageUrls.update(
            (value) => imageUrls,
          );
        }
        return Promise.resolve(imageUrl);
      });
  }

  loadProfiles(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraProfile[]> {
    return this.http
      .getProfile(configuration, this.#authenticationToken(configuration)())
      .then((profiles) => {
        this.#gameConsoleData(configuration).profiles.update(
          (value) => profiles,
        );
        return Promise.resolve(profiles);
      });
  }

  loadSmc(configuration: GameConsoleConfiguration): Promise<AuroraSmc> {
    return this.http
      .getSmc(configuration, this.#authenticationToken(configuration)())
      .then((smc) => {
        this.#gameConsoleData(configuration).smc.update((value) => smc);
        return Promise.resolve(smc);
      });
  }

  loadSystem(configuration: GameConsoleConfiguration): Promise<AuroraSystem> {
    return this.http
      .getSystem(configuration, this.#authenticationToken(configuration)())
      .then((system) => {
        this.#gameConsoleData(configuration).system.update((value) => system);
        return Promise.resolve(system);
      });
  }

  loadTemperature(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraTemperature> {
    return this.http
      .getTemperature(configuration, this.#authenticationToken(configuration)())
      .then((temperature) => {
        this.#gameConsoleData(configuration).temperature.update(
          (value) => temperature,
        );
        return Promise.resolve(temperature);
      });
  }

  loadThreadState(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraThreadState> {
    return this.http
      .getThreadState(configuration, this.#authenticationToken(configuration)())
      .then((threadState) => {
        this.#gameConsoleData(configuration).threadState.update(
          (value) => threadState,
        );
        return Promise.resolve(threadState);
      });
  }

  loadThreads(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraThread[]> {
    return this.http
      .getThread(configuration, this.#authenticationToken(configuration)())
      .then((threads) => {
        this.#gameConsoleData(configuration).threads.update((value) => threads);
        return Promise.resolve(threads);
      });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // misc functions
  ////////////////////////////////////////////////////////////////////////////////
  activeTitleAchievementImageUrl(
    configuration: GameConsoleConfiguration,
    id: number,
  ): Promise<string> {
    return this.http.getImageAchievementUrl(
      configuration,
      this.#authenticationToken(configuration)(),
      `${id}`,
    );
  }

  // TODO rework launching a game
  // required for launching a game through the AuroraGame Service
  authenticationToken(configuration: GameConsoleConfiguration): string | null {
    return this.#authenticationToken(configuration)();
  }

  // TODO use this
  clearState(configuration: GameConsoleConfiguration): void {
    this.#states.delete(configuration.id);
  }

  deleteScreencapture(
    configuration: GameConsoleConfiguration,
    filename: string,
  ): Promise<void> {
    return this.http.deleteScreencapture(
      configuration,
      this.#authenticationToken(configuration)(),
      filename,
    );
  }

  isAuthenticated(configuration: GameConsoleConfiguration): boolean {
    return this.#authenticationToken(configuration)() != null;
  }

  launchExecutable(
    configuration: GameConsoleConfiguration,
    path: string,
    exec: string,
    execType: number,
  ): Promise<void> {
    return this.http.postTitleLaunch(
      configuration,
      this.#authenticationToken(configuration)(),
      path,
      exec,
      execType,
    );
  }

  launchGame(
    configuration: GameConsoleConfiguration,
    game: AuroraGameData,
  ): Promise<void> {
    return this.game.launch(
      configuration,
      this.#authenticationToken(configuration)(),
      game,
    );
  }

  launchLauncher(configuration: GameConsoleConfiguration): Promise<void> {
    return this.loadPlugin(configuration).then((pluginData) => {
      if (pluginData == null) {
        return Promise.reject(
          new Error('Refusing to launch launcher with nullish plugin data'),
        );
      }
      let [path, _, exec] = this.#rpartition(pluginData.path.launcher, '\\');
      // TODO is it safe to assume executable type is xbox 360 executable (xex)?
      let execType = 0;
      return this.launchExecutable(configuration, path, exec, execType);
    });
  }

  login(configuration: GameConsoleConfiguration): Promise<string | null> {
    let token = this.#authenticationToken(configuration)();
    if (token != null) {
      return Promise.resolve(token);
    }
    return this.http
      .getAuthenticationToken(configuration)
      .then((authenticationToken) => {
        this.#authenticationTokens.set(
          configuration.id,
          signal<string | null>(authenticationToken),
        );
        return Promise.resolve(authenticationToken);
      });
  }

  logout(configuration: GameConsoleConfiguration): void {
    this.#authenticationToken(configuration).update((value) => null);
  }

  resumeThreads(configuration: GameConsoleConfiguration): Promise<void> {
    return this.setThreadState(configuration, false);
  }

  screencaptureImageUrl(
    configuration: GameConsoleConfiguration,
    filename: string,
  ): Promise<string> {
    return this.http.getImageScreencaptureUrl(
      configuration,
      this.#authenticationToken(configuration)(),
      filename,
    );
  }

  setThreadState(
    configuration: GameConsoleConfiguration,
    suspend: boolean,
  ): Promise<void> {
    return this.http.postThreadState(
      configuration,
      this.#authenticationToken(configuration)(),
      suspend,
    );
  }

  suspendThreads(configuration: GameConsoleConfiguration): Promise<void> {
    return this.setThreadState(configuration, true);
  }

  takeScreencapture(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraScreencaptureMeta> {
    return this.http.getScreencaptureMeta(
      configuration,
      this.#authenticationToken(configuration)(),
    );
  }
  ////////////////////////////////////////////////////////////////////////////////

  #authenticationToken(
    configuration: GameConsoleConfiguration,
  ): WritableSignal<string | null> {
    let value = this.#authenticationTokens.get(configuration.id);
    if (value === undefined) {
      value = signal<string | null>(null);
      this.#authenticationTokens.set(configuration.id, value);
    }
    return value;
  }

  #gameConsoleData(configuration: GameConsoleConfiguration): AuroraState {
    let value = this.#states.get(configuration.id);
    if (value === undefined) {
      value = {
        activeTitle: signal<AuroraTitle | null>(null),
        activeTitleAchievements: signal<AuroraAchievement[]>([]),
        activeTitleScreencaptureMetas: signal<AuroraScreencaptureMeta[]>([]),
        dashlaunch: signal<AuroraDashlaunch | null>(null),
        memory: signal<AuroraMemory | null>(null),
        plugin: signal<AuroraPlugin | null>(null),
        profileImageUrls: signal<[string, string, string, string]>([
          '',
          '',
          '',
          '',
        ]),
        profiles: signal<(AuroraProfile | null)[]>([null, null, null, null]),
        smc: signal<AuroraSmc | null>(null),
        system: signal<AuroraSystem | null>(null),
        temperature: signal<AuroraTemperature | null>(null),
        threadState: signal<AuroraThreadState | null>(null),
        threads: signal<AuroraThread[]>([]),
      };
      this.#states.set(configuration.id, value);
    }
    return value;
  }

  #rpartition(value: string, delimiter: string): string[] {
    let index = value.lastIndexOf(delimiter);
    if (index === -1) {
      return [value, '', ''];
    }
    return [
      value.substring(0, index),
      delimiter,
      value.substring(index + delimiter.length),
    ];
  }
}
