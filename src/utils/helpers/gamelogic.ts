type Props = {
  [key: string]: any;
};

export function gamelogic(receviedObj: Props) {
  let winner = "noone";
  let matchedCombination;

  const combinations = [
    ["0", "1", "2"],
    ["3", "4", "5"],
    ["6", "7", "8"],
    ["0", "4", "8"],
    ["6", "4", "2"],
    ["0", "3", "6"],
    ["1", "4", "7"],
    ["2", "5", "8"],
  ];

  const receviedObjEntries = Object.entries(receviedObj);

  let playerOneChoices = receviedObjEntries
    .filter((el) => el[1] === 0)
    .map((el) => el[0].match(/\d+/)?.[0] || 0);

  let playerTwoChoices = receviedObjEntries
    .filter((el) => el[1] === 1)
    .map((el) => el[0].match(/\d+/)?.[0] || 0);

  combinations.forEach((combination) => {
    let counter1 = 0;
    let counter2 = 0;
    playerOneChoices.forEach((choice) => {
      if (typeof choice === "string" && combination.includes(choice)) {
        counter1 = counter1 + 1;
      }
    });
    playerTwoChoices.forEach((choice) => {
      if (typeof choice === "string" && combination.includes(choice)) {
        counter2 = counter2 + 1;
      }
    });
    if (counter1 === 3) {
      matchedCombination = combination;
      winner = "player1";
    }
    if (counter2 === 3) {
      matchedCombination = combination;
      winner = "player2";
    }
  });

  return { winner, matchedCombination };
}
