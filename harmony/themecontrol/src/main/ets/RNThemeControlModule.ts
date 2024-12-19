/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import window from '@ohos.window';
import type { common } from '@kit.AbilityKit';
import type { BusinessError } from '@kit.BasicServicesKit';
import { ConfigurationConstant } from '@kit.AbilityKit';
import { appRecovery } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';
import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import logger from './Logger';
import type { TM } from '@rnoh/react-native-openharmony/generated/ts';

interface themeType {
  'dark': number;
  'light': number;
};

enum modeString {
  dark = 0,
  light = 1,
  system = -1,
}

export class RNThemeControlModule extends TurboModule implements TM.RNThemeControl.Spec {
  public static THEME_ENTRY_KEY = 'ThemeControlModuleEntry';
  public static NAME = 'RNThemeControl';


  constructor(ctx) {
    super(ctx);
  }

  public static recoverApplicationTheme(context: common.Context): number {
    const dataPreferences: preferences.Preferences | null =
      preferences.getPreferencesSync(context, { name: RNThemeControlModule.NAME });
    const mode: number = Number(dataPreferences.getSync(RNThemeControlModule.THEME_ENTRY_KEY,
      ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET));
    RNThemeControlModule.forceTheme(context, mode);
    return mode;
  }

  public static forceTheme(context: common.Context, forcedMode: number): void {
    context.getApplicationContext().setColorMode(forcedMode);
  }

  public getThemePreference(): string {
    const context: common.UIAbilityContext = this.ctx.uiAbilityContext;
    const preference: number = context.config.colorMode;
    return this.modeToString(preference);
  }

  public setNavbarAppearance(params: Record<string, number | string | null>): Promise<null> {
    const context: common.UIAbilityContext = this.ctx.uiAbilityContext;
    const bgColor: number | string | null = params.backgroundColor ?? params.backgroundColor;
    const barStyle: number | string | null = params.barStyle ?? params.barStyle;

    window.getLastWindow(context, (getLastWindowErr: BusinessError, data) => {
      const windowClass: window.Window = data;
      if (bgColor !== null) {
        const systemBarProperties: window.SystemBarProperties = {
          navigationBarColor: `#${bgColor.toString(16).substring(2)}`,
        };
        windowClass.setWindowSystemBarProperties(systemBarProperties);
      }
      ;
      const windowStage: window.WindowStage | undefined = context.windowStage;
      windowStage.getMainWindow((getMainWindowErr: BusinessError) => {
        const isLayoutFullScreen: boolean = barStyle === 'dark-content';
        windowClass.setWindowLayoutFullScreen(isLayoutFullScreen, (setWindowLayoutFullScreenErr: BusinessError) => {
        });
      });
    });
    return new Promise((resolve) => resolve(null));
  }

  public setAppBackground(options: Record<string, number | null>): Promise<boolean> {
    const appBackground : number | string | null = options.appBackground ?? options.appBackground;
    const context: common.UIAbilityContext = this.ctx.uiAbilityContext;
    const windowClass: window.Window = null
    window.getLastWindow(context).then(res => {
      res.setWindowBackgroundColor(`#${appBackground.toString(16).substring(2)}`);
    }).catch((getLastWindowErr: BusinessError) => {
      logger.error(`Failed to set the background color + ${getLastWindowErr}`)
    });
    return new Promise((resolve) => resolve(Boolean(windowClass?.getWindowDecorHeight())));
  }

  public setTheme(style: string, options: Record<string, boolean | undefined>): Promise<null> {
    const mode: ConfigurationConstant.ColorMode = this.stringToMode(style);
    if (options.persistTheme || options.restartActivity) {
      this.persistTheme(mode);
    }
    this.setMode(this.stringToMode(style), options.restartActivity);
    return new Promise((resolve) => resolve(null));
  }

  private persistTheme(mode: ConfigurationConstant.ColorMode): void {
    const  dataPreferences: preferences.Preferences | null =
      preferences.getPreferencesSync(this.ctx.uiAbilityContext, { name: RNThemeControlModule.NAME });
    dataPreferences.putSync(RNThemeControlModule.THEME_ENTRY_KEY, mode);
    dataPreferences.flush();
  }

  private setMode(mode: ConfigurationConstant.ColorMode, restartActivity: boolean): void {
    if (restartActivity) {
      appRecovery.restartApp();
    } else {
      const context: common.UIAbilityContext = this.ctx.uiAbilityContext;
      context.getApplicationContext().setColorMode(mode);
    }
  }

  private modeToString(mode: ConfigurationConstant.ColorMode): string {
    return modeString[mode];
  }

  private stringToMode(themeStyle: string): ConfigurationConstant.ColorMode {
    const themeObj: themeType = {
      dark: ConfigurationConstant.ColorMode.COLOR_MODE_DARK,
      light: ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT,
    };
    if (themeObj[themeStyle] === undefined) {
      return ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET;
    } else {
      return themeObj[themeStyle];
    }
  }
}
