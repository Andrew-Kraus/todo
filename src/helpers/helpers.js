import dayjs from 'dayjs';

export function declensionWords(num, firstDec, secondDec, thirdDec) {
    let word = firstDec;
    if (num % 10 === 1 && num % 100 !== 11) {
        word = secondDec;
    } else if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)) {
        word = thirdDec;
    }
    return word;
}

export function declension(num, value) {
    if (value === 'день') {
        return declensionWords(num, 'дней', 'день', 'дня')
    }
}

export function findGap(array) {
    let start = array[0];
    if (start !== 1) {
        start = 1;
        return start
    } else {
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== start) {
                return start;
            }
            start++;
        }
    }
    return start;
}

export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

export function dateDiff(task) {
    let dateTask = dayjs(task.currentDate)
    let dateNow = dayjs()
    return dateNow.diff(dateTask, 'day')
}