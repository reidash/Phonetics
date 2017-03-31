import glob, os, sys

#template for each screen unit audio's JSON file
template = '''{{
    "id": {},
    "word": "{}",
    "wordOptions": [
        "{}",
        "{}"
    ],
    "audioPaths": [
        {}
    ]
}}'''

pairs = {} # A list of array[id][word] for all words with audio recordings, 
           # There are 2 words per id.
paths = {} # A dic[word, dict[version#, filepath]]

#grab all the words from file names and put them into pairs, 
#and grab all the files for the same word and put them into an array of file paths
for file in glob.glob("*.m4a"):
    fullFileName = file
    file = file[:-4]
    parts = file.split("-")

    id = int(parts[0])

    #aggregate content for "pairs"
    if id not in pairs:
        pairs[id] = []
        pairs[id].append(parts[1])
    else:
        if pairs[id][0] != parts[1]:
            pairs[id].append(parts[1])

    #aggregate content "paths"
    pathnum = int(parts[2])
    if parts[1] not in paths:
        paths[parts[1]] = {}
    paths[parts[1]][pathnum] = fullFileName

#create the audio file's JSONs
i = 0
for k, v in pairs.iteritems():
	id_a = 2 * i
	id_b = 2 * i + 1
	i += 1

	word_a = v[0]
	word_b = v[1]

	paths_a = '"' + "assets/audio/" + ('", "'.join(paths[word_a].values())) + '"'
	paths_b = '"' + "assets/audio/" + ('", "'.join(paths[word_b].values())) + '"'

	#for testing:
	#print(template.format(id_a, word_a, word_a, word_b, paths_a))
	#print("\n")
	#print(template.format(id_b, word_b, word_a, word_b, paths_b))
	#print("\n")

	#creating JSON files with f.write
	f = open(str(id_a)+'.json', 'w')
	f.write(template.format(id_a, word_a, word_a, word_b, paths_a))  # python will convert \n to os.linesep
	f.close() 

	f = open(str(id_b)+'.json', 'w')
	f.write(template.format(id_b, word_b, word_a, word_b, paths_b))  # python will convert \n to os.linesep
	f.close() 
