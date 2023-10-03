import fetch from 'node-fetch';
globalThis.fetch = fetch

const joystreamGraphQlEndpoint = "https://joystreamstats.live/graphql";
let totalChannels = 0;
let totalMembers = 0;
let totalVideos = 0;

async function fetchTotalChannelsLength() {
    let limit = 10000;
    let offset = 0;
    let result = [];
    let resultLength = 0;

    while (true) {
        const variables = {
            limit,
            offset,
        };

        const requestBody = JSON.stringify({
            query: queryForTotalChannels(variables),
            variables: variables,
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Content-Length': requestBody.length,
                "User-Agent": "Node",
            },
            body: requestBody,
        };
        try {
            console.log(`JoystreamAuditService::Running query ${JSON.stringify(requestBody)}`);
            const queryResponse = await fetch(
                joystreamGraphQlEndpoint,
                requestOptions
            );
            const response = await queryResponse.json();
            // Access the 'data' property from the parsed response
            result = response["data"]["channels"] || [];
            resultLength += result.length;
        } catch (e) {
            `JoystreamAuditService::fetch::Error fetching: ${requestBody} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
        }

        if (result.length < limit) {
            console.log(
                `JoystreamAuditService::fetchTotalChannelsLength::Reached at the end of block:: ${offset}`
            );
            break;
        }
        offset += limit;
    }
    totalChannels = resultLength;
}

async function fetchTotalMembersLength() {
    let limit = 10000;
    let offset = 0;
    let result = [];
    let resultLength = 0;

    while (true) {
        const variables = {
            limit,
            offset,
        };

        const requestBody = JSON.stringify({
            query: queryForTotalMemberships(variables),
            variables: variables,
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Content-Length': requestBody.length,
                "User-Agent": "Node",
            },
            body: requestBody,
        };
        try {
            console.log(`JoystreamAuditService::Running query ${JSON.stringify(requestBody)}`);
            const queryResponse = await fetch(
                joystreamGraphQlEndpoint,
                requestOptions
            );
            const response = await queryResponse.json();
            // Access the 'data' property from the parsed response
            result = response["data"]["memberships"] || [];
            resultLength += result.length;
        } catch (e) {
            `JoystreamAuditService::fetch::Error fetching: ${requestBody} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
        }

        if (result.length < limit) {
            console.log(
                `JoystreamAuditService::fetchTotalMembersLength::Reached at the end of block:: ${offset}`
            );
            break;
        }
        offset += limit;
    }
    totalMembers = resultLength;
}

async function fetchTotalVideosLength() {
    let limit = 10000;
    let offset = 0;
    let result = [];
    let resultLength = 0;

    while (true) {
        const variables = {
            limit,
            offset,
        };

        const requestBody = JSON.stringify({
            query: queryForTotalVideosCreated(variables),
            variables: variables,
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Content-Length': requestBody.length,
                "User-Agent": "Node",
            },
            body: requestBody,
        };
        try {
            console.log(`JoystreamAuditService::Running query ${JSON.stringify(requestBody)}`);
            const queryResponse = await fetch(
                joystreamGraphQlEndpoint,
                requestOptions
            );
            const response = await queryResponse.json();
            // Access the 'data' property from the parsed response
            result = response["data"]["videos"] || [];
            resultLength += result.length;
        } catch (e) {
            console.log(
                `JoystreamAuditService::fetch::Error fetching: ${requestBody} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
            );
        }
        
        if (result.length < limit) {
            console.log(
                `JoystreamAuditService::fetchTotalVideosLength::Reached at the end of block:: ${offset}`
            );
            break;
        }
        offset += limit;
    }
    totalVideos = resultLength;
    console.log(`TotalChannels: ${totalChannels}`);
    console.log(`TotalVideos: ${totalVideos}`);
    console.log(`TotalMembers: ${totalMembers}`);
}

// query for total channels
function queryForTotalChannels(variables) {
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

// query for total videos
function queryForTotalVideosCreated(variables) {
    const templateQuery = `
        query {
            videos(limit: ${variables.limit} offset: ${variables.offset}) { 
              id
          }
        }
        `;
    return templateQuery;
}

// query for total members
function queryForTotalMemberships(variables) {
    const templateQuery = `
        query {
            memberships(limit: ${variables.limit} offset: ${variables.offset}) { 
              id
          }
        }
        `;
    return templateQuery;
}

fetchTotalChannelsLength()
fetchTotalMembersLength()
fetchTotalVideosLength()
