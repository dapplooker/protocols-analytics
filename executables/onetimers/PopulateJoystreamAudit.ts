const JoystreamAuditService = require('../../joystream/JoystreamAuditService');

// Note: This onetimer is specific to joystream
async function populate() {
  await new JoystreamAuditService().servicePerform();
}

populate().then(() => {
  console.info("DONE");
});
