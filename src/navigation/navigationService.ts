import { navigationRef } from "./navigationRef";
import { RootStackParamList } from "../notifications/types";

type NavigationArgs<RouteName extends keyof RootStackParamList> =
  | [screen: RouteName]
  | [screen: RouteName, params: RootStackParamList[RouteName]];

let pendingNavigation: NavigationArgs<keyof RootStackParamList> | null = null;

export function navigateWhenReady<RouteName extends keyof RootStackParamList>(
  ...args: NavigationArgs<RouteName>
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...(args as any));
  } else {
    pendingNavigation = args as NavigationArgs<keyof RootStackParamList>;
  }
}

export function flushPendingNavigation() {
  if (pendingNavigation && navigationRef.isReady()) {
    navigationRef.navigate(...(pendingNavigation as any));
    pendingNavigation = null;
  }
}
