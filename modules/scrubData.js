let fs = require('fs');
let scrubData = {};

//retrieve only the necessary fields from the GITHUB API response
scrubData.formatData = (jsonData, dataFile) => {
    let formattedData = jsonData.map((commitData) => {
        let commitObj = {}; //each returned value will be an object 

        commitObj['message'] = commitData.commit.message;
        commitObj['author'] = commitData.commit.author;
        commitObj['HTML_URL'] = commitData.html_url;
        commitObj['SHA'] = commitData.sha;

        return commitObj;
    });

   return writeToCommitFile(formattedData, dataFile);
}

//Write the JSON to commits.json file if array of data exists then append to the data, return updated data in the file
let writeToCommitFile = (commitData, dataFile) => {

    let json = JSON.parse(dataFile);
    //Check if the parsed JSON is an array, if so previous data exists (data always is an array of objects) and append to it
    if (Array.isArray(json)) {
        
        commitData.forEach((element) => {
            json.push(element);
        });

        fs.writeFileSync('./data/commits.json', JSON.stringify(json, null, 2));
        return JSON.stringify(json, null , 2);
}
    else {
        fs.writeFile('./data/commits.json', JSON.stringify(commitData, null, 2));
        return JSON.stringify(commitData, null , 2);
    }
};

module.exports = scrubData;