import { useOtaUpdate } from "@/hooks/use-ota-update";
import { ConfirmDialog } from "./confirm-dialog";

export const UpdatePrompt = function () {
  const { isUpdateReady, isRestarting, restartToUpdate, dismissUpdate } =
    useOtaUpdate();

  return (
    <ConfirmDialog
      visible={isUpdateReady}
      title="Update ready"
      message="A new version of Elevra has downloaded. Restart to use it now, or it will apply the next time you open the app."
      confirmLabel="Restart now"
      cancelLabel="Later"
      isLoading={isRestarting}
      onConfirm={restartToUpdate}
      onCancel={dismissUpdate}
    />
  );
};
