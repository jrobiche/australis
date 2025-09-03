import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  AuroraAchievement,
  AuroraDashlaunch,
  AuroraFilebrowserEntry,
  AuroraGameData,
  AuroraMemory,
  AuroraPlugin,
  AuroraProfile,
  AuroraScreencaptureMeta,
  AuroraSmc,
  AuroraSystem,
  AuroraTemperature,
  AuroraThread,
  AuroraThreadState,
  AuroraTitle,
} from '@app/types/aurora';
import { GameConsoleConfiguration, GameConsoleData } from '@app/types/app';
import { TauriService } from '@app/services/tauri.service';
import { UiService } from '@app/services/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuroraHttpService {
  readonly #tauriService = inject(TauriService);
  readonly #uiService = inject(UiService);
  #authenticationTokens: Map<string, WritableSignal<string | null>>;
  #gameConsoleDatas: Map<string, GameConsoleData>;

  httpService: TauriService;

  constructor() {
    this.#authenticationTokens = new Map<
      string,
      WritableSignal<string | null>
    >();
    this.#gameConsoleDatas = new Map<string, GameConsoleData>();
    this.httpService = this.#tauriService;
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
        this.#uiService.compareConsoleScreencaptureMetas,
      ),
    );
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
    return this.httpService
      .auroraHttpTitleGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
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
    return this.httpService
      .auroraHttpAchievementGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((activeTitleAchievements) => {
        this.#gameConsoleData(configuration).activeTitleAchievements.update(
          (value) => activeTitleAchievements,
        );
        return Promise.resolve(activeTitleAchievements);
      });
  }

  loadActiveTitleScreencaptureMetas(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraScreencaptureMeta[]> {
    return this.httpService
      .auroraHttpScreencaptureMetaListGet(
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
    return this.httpService
      .auroraHttpDashlaunchGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((dashlaunch) => {
        this.#gameConsoleData(configuration).dashlaunch.update(
          (value) => dashlaunch,
        );
        return Promise.resolve(dashlaunch);
      });
  }

  loadMemory(configuration: GameConsoleConfiguration): Promise<AuroraMemory> {
    return this.httpService
      .auroraHttpMemoryGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((memory) => {
        this.#gameConsoleData(configuration).memory.update((value) => memory);
        return Promise.resolve(memory);
      });
  }

  loadPlugin(configuration: GameConsoleConfiguration): Promise<AuroraPlugin> {
    return this.httpService
      .auroraHttpPluginGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((plugin) => {
        this.#gameConsoleData(configuration).plugin.update((value) => plugin);
        return Promise.resolve(plugin);
      });
  }

  loadProfileImageUrl(
    configuration: GameConsoleConfiguration,
    index: number,
  ): Promise<string> {
    return this.httpService
      .auroraHttpImageProfileGetUrl(
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
    return this.httpService
      .auroraHttpProfileGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((profiles) => {
        this.#gameConsoleData(configuration).profiles.update(
          (value) => profiles,
        );
        return Promise.resolve(profiles);
      });
  }

  loadSmc(configuration: GameConsoleConfiguration): Promise<AuroraSmc> {
    return this.httpService
      .auroraHttpSmcGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((smc) => {
        this.#gameConsoleData(configuration).smc.update((value) => smc);
        return Promise.resolve(smc);
      });
  }

  loadSystem(configuration: GameConsoleConfiguration): Promise<AuroraSystem> {
    return this.httpService
      .auroraHttpSystemGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
      .then((system) => {
        this.#gameConsoleData(configuration).system.update((value) => system);
        return Promise.resolve(system);
      });
  }

  loadTemperature(
    configuration: GameConsoleConfiguration,
  ): Promise<AuroraTemperature> {
    return this.httpService
      .auroraHttpTemperatureGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
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
    return this.httpService
      .auroraHttpThreadStateGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
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
    return this.httpService
      .auroraHttpThreadGet(
        configuration,
        this.#authenticationToken(configuration)(),
      )
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
    return this.httpService.auroraHttpImageAchievementGetUrl(
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
  clearData(configuration: GameConsoleConfiguration): void {
    this.#gameConsoleDatas.delete(configuration.id);
  }

  deleteScreencapture(
    configuration: GameConsoleConfiguration,
    filename: string,
  ): Promise<void> {
    return this.httpService.auroraHttpScreencaptureDelete(
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
    return this.httpService.auroraHttpTitleLaunchPost(
      configuration,
      this.#authenticationToken(configuration)(),
      path,
      exec,
      execType,
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
    return this.httpService
      .auroraHttpAuthenticationTokenGet(configuration)
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
    return this.httpService.auroraHttpImageScreencaptureGetUrl(
      configuration,
      this.#authenticationToken(configuration)(),
      filename,
    );
  }

  setThreadState(
    configuration: GameConsoleConfiguration,
    suspend: boolean,
  ): Promise<void> {
    return this.httpService.auroraHttpThreadStatePost(
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
    return this.httpService.auroraHttpScreencaptureMetaGet(
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

  #gameConsoleData(configuration: GameConsoleConfiguration): GameConsoleData {
    let value = this.#gameConsoleDatas.get(configuration.id);
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
      this.#gameConsoleDatas.set(configuration.id, value);
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
