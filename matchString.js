const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function writeToOutput(data) {
    fs.appendFile('OutputFile.txt', data, (err) => {
        if (err) throw err;
    })
}

function parseYmlFile(file) {
    // get the file using path
    const filePath = path.join('./inputFolder', file);

    // read the file content in synchronous task
    const fileContents = fs.readFileSync(filePath, 'utf8'); 
    const data = yaml.load(fileContents);
    return data;
}

function findKeyValues(data, targetKey) {
    const values = [];
  
    function findKeyRecursive(obj) {
        for (const key in obj) {
            if (key === targetKey) {
                values.push(obj[key]);
            } else if (typeof obj[key] === 'object') {
                findKeyRecursive(obj[key]);
            }
        }
    }
  
    findKeyRecursive(data);
    return values;
  }

async function readFiles() {
    // get all the input files in the directory
    const files = await fs.promises.readdir("./inputFolder");
    console.log(files);

    // loop through the files and read the content
    for(const file of files) {
        // parse the html and get it as key value pairs
        const parsedData = parseYmlFile(file);
        
        if(parsedData) {
            // find the values for the key
            const tagsValues = findKeyValues(parsedData, "tags");
            
            // create output text
            let tagsValuesString = 'NA';
            if(tagsValues.length > 0) {
                tagsValuesString = tagsValues.join(',');
            }
            
            const dataToWrite = `${file},${tagsValuesString}\n`;
            console.log(dataToWrite);

            writeToOutput(dataToWrite)
        }
    }
}

(function main() {
    readFiles();
})();
