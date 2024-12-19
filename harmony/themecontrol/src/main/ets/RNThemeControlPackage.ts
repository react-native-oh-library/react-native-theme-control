/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import {
    RNPackage,
    TurboModulesFactory,
  } from "@rnoh/react-native-openharmony/ts";
  import type {
    TurboModule,
    TurboModuleContext,
  } from "@rnoh/react-native-openharmony/ts";
  import { TM } from "@rnoh/react-native-openharmony/generated/ts";
  import { RNThemeControlModule } from './RNThemeControlModule';
  
  class RNThemeControlModulesFactory extends TurboModulesFactory {
    createTurboModule(name: string): TurboModule | null {
      if (name === TM.RNThemeControl.NAME) {
        return new RNThemeControlModule(this.ctx);
      }
      return null;
    }
  
    hasTurboModule(name: string): boolean {
      return name === TM.RNThemeControl.NAME;
    }
  }
  
  export class RNThemeControlPackage extends RNPackage {
    createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
      return new RNThemeControlModulesFactory(ctx);
    }
  }