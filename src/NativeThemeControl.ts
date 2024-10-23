import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  setTheme(style: string, options: Object): Promise<null>,
  setAppBackground(options: Object): Promise<boolean>,
  setNavbarAppearance(params: Object): Promise<null>,
  getThemePreference(): string
}

export default TurboModuleRegistry.get<Spec>("RNThemeControl") as Spec | null;