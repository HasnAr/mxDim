

getFrequency = function (string, callback) {
  //console.log(string)
  var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()0-9]/g,""),
      words = cleanString.split(' '),
      cleanStringNandS = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
      wordsAndNum = cleanStringNandS.split(' '),
      frequencies = {}, numFreq={}, freq={},
      cleanNumbers = string.replace(/\D+/g, " "),
      numbers= cleanNumbers.split(' '),
      number, word, i, resualt = {},wordAndNum;

  //console.log(cleanNumbers)
  //console.log(cleanString)
   for( i=0; i<numbers.length; i++ ) {
    number = numbers[i];
    numFreq[number] = numFreq[number] || 0;
    numFreq[number]++;
  }
  numbers = Object.keys(numFreq);
  numbers = numbers.sort(function (a,b) { return numFreq[b] -numFreq[a];});

  resualt.mostFreqNumber = numbers[0];
  //console.log(resualt)

  for( i=0; i<words.length; i++ ) {
    word = words[i];
    frequencies[word] = frequencies[word] || 0;
    frequencies[word]++;
  }
  words = Object.keys( frequencies );
  words = words.sort(function(a, b){ return frequencies[b] - frequencies[a];});
  resualt.mostFreqWord = words[0]


for( i=0; i<wordsAndNum.length; i++ ) {
    wordAndNum = wordsAndNum[i];
    freq[wordAndNum] = freq[wordAndNum] || 0;
    freq[wordAndNum]++;
  }
  wordsAndNum = Object.keys( freq );  
  resualt.wordsAndNumbersFreq= freq;
  //console.log(resualt)
  callback(JSON.stringify(resualt))
  return "";
}

collectData = function(request, callback) {

  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(JSON.parse(data));
  });
};



exports.getFrequency = getFrequency;
exports.collectData = collectData;

//console.log(getFrequency(str));