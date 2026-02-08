import { useQueryClient } from "@tanstack/react-query";

import type { UpdateUserSettingsDto } from "@/shared/api/generated/model";
import {
  getUserSettingsControllerGetSettingsQueryKey,
  useUserSettingsControllerGetSettings,
  useUserSettingsControllerUpdateSettings,
} from "@/shared/api/generated/user-settings/user-settings";

export function useUserSettings() {
  return useUserSettingsControllerGetSettings();
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useUserSettingsControllerUpdateSettings<
    unknown,
    UpdateUserSettingsDto
  >({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getUserSettingsControllerGetSettingsQueryKey(),
        });
      },
    },
  });
}
