/**
 * Returns a list of objects grouped by some property. For example:
 * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
 *
 * returns:
 * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
 *    'red': [{name: 'Jack', team: 'red'}]
 * }
 *
 * @param {any[]} objects: An array of objects
 * @param {string|Function} property: A property to group objects by
 * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
 */
 function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}

// Initialize DOM elements that will be used.
const outputDescription = document.querySelector('#output_description');
const wordOutput = document.querySelector('#word_output');
const showRhymesButton = document.querySelector('#show_rhymes');
const showSynonymsButton = document.querySelector('#show_synonyms');
const wordInput = document.querySelector('#word_input');
const savedWords = document.querySelector('#saved_words');
const saveWordButton = document.querySelector('.btn');

// Stores saved words.
const savedWordsArray = [];

/**
 * Makes a request to Datamuse and updates the page with the
 * results.
 * 
 * Use the getDatamuseRhymeUrl()/getDatamuseSimilarToUrl() functions to make
 * calling a given endpoint easier:
 * - RHYME: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
 * - SIMILAR TO: `datamuseRequest(getDatamuseRhymeUrl(), () => { <your callback> })
 *
 * @param {String} url
 *   The URL being fetched.
 * @param {Function} callback
 *   A function that updates the page.
 */
function datamuseRequest(url, callback) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // This invokes the callback that updates the page.
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

/**
 * Gets a URL to fetch rhymes from Datamuse
 *
 * @param {string} rel_rhy
 *   The word to be rhymed with.
 *
 * @returns {string}
 *   The Datamuse request URL.
 */
function getDatamuseRhymeUrl(rel_rhy) {
    return `https://api.datamuse.com/words?${(new URLSearchParams({'rel_rhy': wordInput.value})).toString()}`;
}

/**
 * Gets a URL to fetch 'similar to' from Datamuse.
 *
 * @param {string} ml
 *   The word to find similar words for.
 
 * @returns {string}
 *   The Datamuse request URL.
 */
function getDatamuseSimilarToUrl(ml) {
    return `https://api.datamuse.com/words?${(new URLSearchParams({'ml': wordInput.value})).toString()}`;
}

/**
 * Add a word to the saved words array and update the #saved_words `<span>`.
 *
 * @param {string} word
 *   The word to add.
 */
function addToSavedWords(word) {
    // You'll need to finish this...
    if(!savedWordsArray.includes(word)) {
        savedWordsArray.push(word)
        savedWords.innerHTML = `<p>${savedWordsArray.join()}</p>`
    }
}

savedWords.innerHTML += "<p>(None)</p>"

// Add event listeners here.
showRhymesButton.addEventListener('click', () => {
    wordOutput.innerHTML = "<p>.....loading</p>"
    datamuseRequest(getDatamuseRhymeUrl(), displayRhymingWords)

})

showSynonymsButton.addEventListener('click', () => {
    wordOutput.innerHTML = "<p>.....loading</p>"
    datamuseRequest(getDatamuseSimilarToUrl(), displaySimilarWords)
})

document.addEventListener('click', (e) => {
    if (e.target.classList.contains("save")) {
        // save btn clicked
        let wordToBeSaved = e.target.parentElement.textContent
        addToSavedWords(wordToBeSaved)
    }
})


// Add additional functions/callbacks here.
function displayRhymingWords(rhymingData) {
    wordOutput.innerHTML = ""
    outputDescription.innerHTML = ""
    wordOutputHtml = ""
    console.log("R"+rhymingData)
    groupedWords = groupBy(rhymingData, 'numSyllables')
    if( Object.keys(groupedWords).length === 0) {
        wordOutput.innerHTML = "<h3>No results</h3>"
    } else {
        outputDescription.innerHTML = `<h2>Words that rhyme with ${wordInput.value}</h2>`
        console.log(groupedWords)
        for(key in groupedWords) {
            console.log("Key is "+key)
            wordOutputHtml += `<h3>Syllables: ${key}</h3>`
            allSyllableWords = groupedWords[key]
            wordOutputHtml += "<ul>"
            for(wordKey in allSyllableWords) {
                wordData = allSyllableWords[wordKey]
                wordOutputHtml += `<li>${wordData['word']}<input class="btn btn-outline-success save" type="button" value="Save" role="button"></li>`
            }
            //wordOutput.innerHTML += "</ul>"
            wordOutputHtml += "</ul>"
        }
        console.log("Word OP HTML"+wordOutputHtml)
        wordOutput.innerHTML = wordOutputHtml
    }
}

function displaySimilarWords(similarData) {
    wordOutput.innerHTML = ""
    outputDescription.innerHTML = ""
    wordOpHtml = ""
    console.log("Similar"+similarData)
    if( Object.keys(similarData).length === 0) {
        console.log("0 similar results")
        wordOutput.innerHTML = "<h3>No results</h3>"
    } else {
        outputDescription.innerHTML = `<h2>Words with a similar meaning to ${wordInput.value}</h2>`
        console.log("Synonyms data"+similarData)
        wordOpHtml += "<ul>"
        for(index in similarData) {
            console.log("Considering ", similarData[index])
            similarWordData = similarData[index]
            wordOpHtml += `<li>${similarWordData['word']}<input class="btn btn-outline-success save" type="button" value="Save" role="button"></li>`
        }
        wordOpHtml += "</ul>"
        wordOutput.innerHTML = wordOpHtml
    }
}


