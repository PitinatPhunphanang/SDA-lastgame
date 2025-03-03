const { broadcast } = require("../../../../websocket");

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    console.log("New player created:", result);

    broadcast({
      type: "playerCreated",
      player: result,
    });
  },

  async afterUpdate(event) {
    const { result } = event;
    console.log("Player updated:", result);

    broadcast({
      type: "playerUpdated",
      player: result,
    });
  },
};
