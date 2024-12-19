/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  setTheme(style: string, options: Object): Promise<null>,
  setAppBackground(options: Object): Promise<boolean>,
  setNavbarAppearance(params: Object): Promise<null>,
  getThemePreference(): string
}

export default TurboModuleRegistry.get<Spec>("RNThemeControl") as Spec | null;