import fetch from 'node-fetch';
globalThis.fetch = fetch

const joystreamGraphQlEndpoint = "https://joystreamstats.live/graphql";
let totalChannels = 0;
let totalMembers = 0;
let totalVideos = 0;

async function fetchTotalChannelsLength() {
    let limit = 1000;
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
            console.log(`Running query ${requestBody}`);
            const queryResponse = await fetch(
                joystreamGraphQlEndpoint,
                requestOptions
            );
            const response = queryResponse.json();
            // Access the 'data' property from the parsed response
            result = response["data"]["channels"] || [];
            resultLength += result.length;
        } catch (e) {
            `JoystreamAuditService::fetch::Error fetching: ${requestBody} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
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
    totalChannels = resultLength;
}

async function fetchTotalMembersLength() {
    let limit = 2000;
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
            console.log(`Running query ${requestBody}`);
            const queryResponse = await fetch(
                joystreamGraphQlEndpoint,
                requestOptions
            );
            const response = queryResponse.json();
            // Access the 'data' property from the parsed response
            result = response["data"]["memberships"] || [];
            resultLength += result.length;
        } catch (e) {
            `JoystreamAuditService::fetch::Error fetching: ${requestBody} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
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
            console.log(`Running query ${requestBody}`);
            const queryResponse = await fetch(
                joystreamGraphQlEndpoint,
                requestOptions
            );
            const response = queryResponse.json();
            // Access the 'data' property from the parsed response
            result = response["data"]["videos"] || [];
            resultLength += result.length;
        } catch (e) {
            console.log(
                `JoystreamAuditService::fetch::Error fetching: ${requestBody} , variables: ${JSON.stringify(variables)}, Error: ${e.message}`
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
    totalVideos = resultLength;
}

async function response() {
    console.log(`TotalChannels: ${totalChannels}`);
    console.log(`TotalVideos: ${totalVideos}`);
    console.log(`TotalMembers: ${totalMembers}`);
}

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
response()
