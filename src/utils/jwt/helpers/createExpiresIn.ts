// seconds, minutes, hours, days
export const millisecondsInSecond = 1000;
const secondsInMinute = 60;
const minutesInHour = 60;
const hoursInDay = 24;

export const millisecondsInMinute = millisecondsInSecond * secondsInMinute;
export const millisecondsInHour = millisecondsInMinute * minutesInHour;
export const millisecondsInDay = millisecondsInHour * hoursInDay;

// Map to convert time units to milliseconds
const formatTimeMap = new Map([
  ['s', millisecondsInSecond],
  ['m', millisecondsInMinute],
  ['h', millisecondsInHour],
  ['d', millisecondsInDay],
]);

export const createExpiresIn = (exp: string | number) => {
  const currentTime = Date.now();
  let expNumber;

  if (typeof exp === 'string') {
    expNumber = parseInt(exp);

    if (isNaN(expNumber)) {
      throw new Error('Wrong expire date format.');
    }

    const lastChar = exp[exp.length - 1].toLowerCase();
    const format = formatTimeMap.get(lastChar);

    if (format) {
      return currentTime + format * expNumber;
    } else if (isNaN(Number(lastChar))) {
      throw new Error('Unknown time format character.');
    }
  } else {
    expNumber = exp;
  }

  return currentTime + expNumber;
};
