export class Util {
    shuffle(array: any[]) {

        if(!array) {
            return;
        }

        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    getNext(curr: number, length: number) {
        curr++;

        if (curr >= length) {
            return -1; //end of session
        }

        return curr;
    }
}