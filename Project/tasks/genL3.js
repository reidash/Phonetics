fs = require('fs')
fs.readFile('spk-L3', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    let unit;
    let array = data.split('\n');
    for (let i = 0; i < array.length; i++) {
        if(!array[i]) {
            continue;
        }

        unit = createUnit(array[i], i);
        let filePath = i + '.json';
        fs.writeFile(filePath, JSON.stringify(unit), function (err) {
            if(!err) {
                return;
            }

            console.log('err: ' + err.message);
        }); 
    }
});

function createUnit(word, id) {
    return {
        "id": id,
        "word": word,
        "wordOptions": [],
        "audioPaths": []
    };
}