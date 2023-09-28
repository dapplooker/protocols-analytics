import fetch from "node-fetch"
import JoystreamConstants from "../lib/globalConstant/JoystreamConstants";

export default class JoystreamAuditService {
    private joystreamGraphQlEndpoint: string;

    private totalChannels: number;

    private totalVideos: number;

    private totalMembers: number;

    public constructor() {
        const oThis = this;
        oThis.joystreamGraphQlEndpoint = JoystreamConstants.joystreamGraphQLEndpoint;
        oThis.totalChannels = 0;
        oThis.totalVideos = 0;
        oThis.totalMembers = 0;
    }

    public async servicePerform() {
        const oThis = this;

        await oThis.fetchTotalChannelsLength();

        await oThis.fetchTotalVideosLength();

        await oThis.fetchTotalMembersLength();

        await oThis.result();

    }

    private async fetchTotalChannelsLength() {
        const oThis = this;
        let limit = 1000;
        let offset = 0;
        let result: any[] = [];
        let resultLength = 0;

        while (true) {
            const variables = {
                limit,
                offset,
            }

            const requestBody = {
                query: oThis.queryForTotalChannels(variables),
                variables: variables
            };

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Node'
                },
                body: JSON.stringify(requestBody)
            };
            try {
                console.log(`Running query ${JSON.stringify(requestBody)}  variable : ${JSON.stringify(variables)}`);
                const queryResponse = await fetch(oThis.joystreamGraphQlEndpoint, requestOptions)
                // Access the 'data' property from the parsed response
                result = queryResponse["data"]["channels"] || [];
                resultLength += result.length;
            } catch (e) {
                console.log(`JoystreamAuditService::fetch::Error fetching: ${JSON.stringify(requestBody)} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`);
            }

            //Need to verify
            if (result.length < limit) {
                console.log(`JoystreamAuditService::fetchTotalChannelsLength::Reached at the end of block:: ${offset}`);
                break;
            }
            offset += limit;
        }
        oThis.totalChannels = resultLength;
    }

    private async fetchTotalMembersLength() {
        const oThis = this;
        let limit = 2000;
        let offset = 0;
        let result: any[] = [];
        let resultLength = 0;

        while (true) {
            const variables = {
                limit,
                offset,
            }

            const requestBody = {
                query: oThis.queryForTotalMemberships(variables),
                variables: variables
            };

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Node'
                },
                body: JSON.stringify(requestBody)
            };
            try {
                console.log(`Running query ${JSON.stringify(requestBody)}  variable : ${JSON.stringify(variables)}`);
                const queryResponse = await fetch(oThis.joystreamGraphQlEndpoint, requestOptions)
                // Access the 'data' property from the parsed response
                result = queryResponse["data"]["memberships"] || [];
                resultLength += result.length;
            } catch (e) {
                console.log(`JoystreamAuditService::fetch::Error fetching: ${JSON.stringify(requestBody)} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`);
            }

            //Need to verify
            if (result.length < limit) {
                console.log(`JoystreamAuditService::fetchTotalMembersLength::Reached at the end of block:: ${offset}`);
                break;
            }
            offset += limit;
        }
        oThis.totalMembers = resultLength;
    }

    private async fetchTotalVideosLength() {
        const oThis = this;
        let limit = 10000;
        let offset = 0;
        let result: any[] = [];
        let resultLength = 0;

        while (true) {
            const variables = {
                limit,
                offset,
            }

            const requestBody = {
                query: oThis.queryForTotalVideosCreated(variables),
                variables: variables
            };

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Node'
                },
                body: JSON.stringify(requestBody)
            };
            try {
                console.log(`Running query ${JSON.stringify(requestBody)}  variable : ${JSON.stringify(variables)}`);
                const queryResponse = await fetch(oThis.joystreamGraphQlEndpoint, requestOptions)
                // Access the 'data' property from the parsed response
                result = queryResponse["data"]["videos"] || [];
                resultLength += result.length;
            } catch (e) {
                console.log(`JoystreamAuditService::fetch::Error fetching: ${JSON.stringify(requestBody)} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`);
            }

            //Need to verify
            if (result.length < limit) {
                console.log(`JoystreamAuditService::fetchTotalVideosLength::Reached at the end of block:: ${offset}`);
                break;
            }
            offset += limit;
        }
        oThis.totalVideos = resultLength;
    }

    private queryForTotalChannels(variables: { limit: number, offset: number }) {
        const templateQuery = `
        query {
            channels(where: { totalVideosCreated_gt: 0 } limit: ${variables.limit} offset: ${variables.offset}) { 
              id
              totalVideosCreated
            }
          }
        `;
        return templateQuery;
    }

    private queryForTotalVideosCreated(variables: { limit: number, offset: number }) {
        const templateQuery = `
        query {
            videos(limit: ${variables.limit} offset: ${variables.offset}) { 
              id
          }
        }
        `;
        return templateQuery;
    }

    private queryForTotalMemberships(variables: { limit: number, offset: number }) {
        const templateQuery = `
        query {
            memberships(limit: ${variables.limit} offset: ${variables.offset}) { 
              id
          }
        }
        `;
        return templateQuery;
    }

    private async result() {
        const oThis = this;
        console.log(`TotalChannels: ${oThis.totalChannels}`);
        console.log(`TotalVideos: ${oThis.totalVideos}`);
        console.log(`TotalMembers: ${oThis.totalMembers}`);
    }
}