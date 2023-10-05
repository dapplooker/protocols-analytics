import fetch from 'node-fetch';
globalThis.fetch = fetch

const joystreamGraphQlEndpoint = "https://joystreamstats.live/graphql";
let totalChannels = 0;
let totalMembers = 0;
let totalVideos = 0;

//fetch data
async function fetchData(requestBody, dataKey) {
    let result = [];
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Content-Length': requestBody.length,
                "User-Agent": "Node",
            },
            body: requestBody,
        };
        console.log(`JoystreamAuditService::Running query ${JSON.stringify(requestBody)}`);
        const queryResponse = await fetch(
            joystreamGraphQlEndpoint,
            requestOptions
        );
        const response = await queryResponse.json();
        // Access the 'data' property from the parsed response
        result = response["data"][dataKey] || [];
    } catch (e) {
        console.log(
            `JoystreamAuditService::fetch::Error fetching: ${requestBody} , Error: ${e.message}`
        );
    }

    return result || [];
}

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

        const dataKey = "channels";
        result = await fetchData(requestBody, dataKey);

        resultLength += result.length;
        
        if (result.length < limit) {
            console.log(
                `JoystreamAuditService::fetchTotalVideosLength::Reached at the end of block:: ${offset}`
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

        const dataKey = "memberships";
        result = await fetchData(requestBody, dataKey);

        resultLength += result.length;
        
        if (result.length < limit) {
            console.log(
                `JoystreamAuditService::fetchTotalVideosLength::Reached at the end of block:: ${offset}`
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

        const dataKey = "videos";
        result = await fetchData(requestBody, dataKey);

        resultLength += result.length;
        
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

async function results() {
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

(async () => {
    await fetchTotalChannelsLength();
    console.log("Done fetching total channels");

    await fetchTotalMembersLength();
    console.log("Done fetching total members");

    await fetchTotalVideosLength();
    console.log("Done fetching total videos");

    await results();
})();
