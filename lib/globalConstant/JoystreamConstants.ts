class JoystreamConstants {

    public get joystreamGraphQLEndpoint(): string {
      return "https://joystreamstats.live/graphql";
      // return "https://query.joystream.org/graphql";
      // return "https://hydra.joystream.org/graphql";
    }
  
    public isJoystreamEndpoint(subGraphEndPoint: string) {
      const oThis = this;
      return (subGraphEndPoint === oThis.joystreamGraphQLEndpoint);
    }
  
    public millisecondsToISODatetime(timestamp: any) {
      return new Date(timestamp).toISOString();
    }
  }
  
  export default new JoystreamConstants();
  