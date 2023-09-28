import fetch from 'node-fetch';

class JoystreamAuditService {

    constructor() {
        const oThis = this;
        oThis.joystreamGraphQlEndpoint = "https://joystreamstats.live/graphql";
        oThis.totalChannels = 0;
        oThis.totalVideos = 0;
        oThis.totalMembers = 0;
        oThis.servicePerform();
    }

    
    async servicePerform() {
        const oThis = this;

        await oThis.fetchTotalChannelsLength();

        await oThis.fetchTotalVideosLength();

        await oThis.fetchTotalMembersLength();

        await oThis.result();
    }

    async fetchTotalChannelsLength() {
        const oThis = this;
        let limit = 1000;
        let offset = 0;
        let result = [];
        let resultLength = 0;

        while (true) {
            const variables = {
                limit,
                offset,
            };

            const requestBody = {
                query: oThis.queryForTotalChannels(variables),
                variables: variables,
            };

            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Node",
                },
                body: JSON.stringify(requestBody),
            };
            try {
                console.log(
                    `Running query ${JSON.stringify(
                        requestBody
                    )}  variable : ${JSON.stringify(variables)}`
                );
                const queryResponse = await fetch(
                    oThis.joystreamGraphQlEndpoint,
                    requestOptions
                );
                // Access the 'data' property from the parsed response
                result = queryResponse["data"]["channels"] || [];
                resultLength += result.length;
            } catch (e) {
                console.log(
                    `JoystreamAuditService::fetch::Error fetching: ${JSON.stringify(
                        requestBody
                    )} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
                );
            }

            //Need to verify
            if (result.length < limit) {
                console.log(
                    `JoystreamAuditService::fetchTotalChannelsLength::Reached at the end of block:: ${offset}`
                );
                break;
            }
            offset += limit;
        }
        oThis.totalChannels = resultLength;
    }

    async fetchTotalMembersLength() {
        const oThis = this;
        let limit = 2000;
        let offset = 0;
        let result = [];
        let resultLength = 0;

        while (true) {
            const variables = {
                limit,
                offset,
            };

            const requestBody = {
                query: oThis.queryForTotalMemberships(variables),
                variables: variables,
            };

            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Node",
                },
                body: JSON.stringify(requestBody),
            };
            try {
                console.log(
                    `Running query ${JSON.stringify(
                        requestBody
                    )}  variable : ${JSON.stringify(variables)}`
                );
                const queryResponse = await fetch(
                    oThis.joystreamGraphQlEndpoint,
                    requestOptions
                );
                // Access the 'data' property from the parsed response
                result = queryResponse["data"]["memberships"] || [];
                resultLength += result.length;
            } catch (e) {
                console.log(
                    `JoystreamAuditService::fetch::Error fetching: ${JSON.stringify(
                        requestBody
                    )} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
                );
            }

            //Need to verify
            if (result.length < limit) {
                console.log(
                    `JoystreamAuditService::fetchTotalMembersLength::Reached at the end of block:: ${offset}`
                );
                break;
            }
            offset += limit;
        }
        oThis.totalMembers = resultLength;
    }

    async fetchTotalVideosLength() {
        const oThis = this;
        let limit = 10000;
        let offset = 0;
        let result = [];
        let resultLength = 0;

        while (true) {
            const variables = {
                limit,
                offset,
            };

            const requestBody = {
                query: oThis.queryForTotalVideosCreated(variables),
                variables: variables,
            };

            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Node",
                },
                body: JSON.stringify(requestBody),
            };
            try {
                console.log(
                    `Running query ${JSON.stringify(
                        requestBody
                    )}  variable : ${JSON.stringify(variables)}`
                );
                const queryResponse = await fetch(
                    oThis.joystreamGraphQlEndpoint,
                    requestOptions
                );
                // Access the 'data' property from the parsed response
                result = queryResponse["data"]["videos"] || [];
                resultLength += result.length;
            } catch (e) {
                console.log(
                    `JoystreamAuditService::fetch::Error fetching: ${JSON.stringify(
                        requestBody
                    )} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
                );
            }

            //Need to verify
            if (result.length < limit) {
                console.log(
                    `JoystreamAuditService::fetchTotalVideosLength::Reached at the end of block:: ${offset}`
                );
                break;
            }
            offset += limit;
        }
        oThis.totalVideos = resultLength;
    }

    queryForTotalChannels(variables) {
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

    queryForTotalVideosCreated(variables) {
        const templateQuery = `
        query {
            videos(limit: ${variables.limit} offset: ${variables.offset}) { 
              id
          }
        }
        `;
        return templateQuery;
    }

    queryForTotalMemberships(variables) {
        const templateQuery = `
        query {
            memberships(limit: ${variables.limit} offset: ${variables.offset}) { 
              id
          }
        }
        `;
        return templateQuery;
    }

    async result() {
        const oThis = this;
        console.log(`TotalChannels: ${oThis.totalChannels}`);
        console.log(`TotalVideos: ${oThis.totalVideos}`);
        console.log(`TotalMembers: ${oThis.totalMembers}`);
    }
}

export default JoystreamAuditService;
