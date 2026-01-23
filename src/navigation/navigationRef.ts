import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../notifications/types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// export function navigate(name: keyof RootStackParamList): void;

// export function navigate<T extends keyof RootStackParamList>(
//   name: T,
//   params: RootStackParamList[T],
// ): void;

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args:
    | [screen: RouteName]
    | [screen: RouteName, params: RootStackParamList[RouteName]]
) {
  if (!navigationRef.isReady()) return;

  navigationRef.navigate(...(args as any));
}
