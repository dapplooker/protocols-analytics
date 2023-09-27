import JoystreamAuditService from '../../joystream/JoystreamAuditService';
import Logger from "../../lib/Logger";

// Note: This onetimer is specific to joystream
async function populate(): Promise<void> {
  await new JoystreamAuditService().servicePerform();
}

populate().then(() => {
  Logger.info("DONE");
});