const { promises: fs } = require('fs');
const readme = require('./readme');

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function generateNewREADME() {
  const readmeRow = readme.split('\n');

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (identifierIndex === -1 || !readmeRow[identifierIndex]) return;
    readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
      `<#${identifier}>`,
      replaceText
    );
  }

  const identifierToUpdate = {
    day_before_new_years: getDBNWSentence(),
    today_date: getTodayDate(),
    karimbot_signing: getKarimBotSigning(),
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRow.join('\n');
}

const moodByDay = {
  1: 'hate',
  2: 'wickedness',
  3: 'pleasure',
  4: 'wickedness',
  5: 'cruelty',
  6: 'horror',
  7: 'love',
};

function getKarimBotSigning() {
  const mood = moodByDay[today.getDay() + 1] || 'love';
  return `🤖 This README.md is updated with ${mood}, by KarimBot ❤️`;
}

function getTodayDate() {
  return today.toDateString();
}

function getDBNWSentence() {
  const nextYear = today.getFullYear() + 1;
  const newYearDate = new Date(nextYear, 0, 1);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const dayUntilNewYear = Math.round((newYearDate.getTime() - todayMidnight.getTime()) / msInOneDay);

  return `**${dayUntilNewYear} day${dayUntilNewYear > 1 ? 's' : ''} before ${nextYear} ⏱** days before new years`;
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = (text) => fs.writeFile('./README.md', text);

async function main() {
  const newREADME = generateNewREADME();
  console.log(newREADME);
  await updateREADMEFile(newREADME);
}
main();
