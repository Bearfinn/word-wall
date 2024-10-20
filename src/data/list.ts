import { Board } from "../types";

export const BOARDS: Board[] = [
  {
    path: "sample-board",
    name: "Sample Board",
    description: "A sample board with four groups of words.",
    wordGroups: [
      { groupName: "Animals", words: ["cat", "dog", "elephant", "lion"] },
      { groupName: "Fruits", words: ["apple", "banana", "orange", "pear"] },
      { groupName: "Colors", words: ["red", "green", "blue", "yellow"] },
      { groupName: "Numbers", words: ["one", "two", "three", "four"] },
    ],
  },
  {
    path: "food-board",
    name: "Food Board",
    description: "A board with four groups of food words.",
    wordGroups: [
      { groupName: "Fruits", words: ["apple", "banana", "orange", "pear"] },
      { groupName: "Vegetables", words: ["carrot", "potato", "broccoli", "tomato"] },
      { groupName: "Meats", words: ["beef", "chicken", "pork", "lamb"] },      
      { groupName: "Grains", words: ["rice", "wheat", "corn", "barley"] },
    ],
  },
  {
    path: "kpop-board-1",
    name: "K-Pop Board",
    description: "A board with four groups of K-Pop words.",
    wordGroups: [
      { groupName: "Has a song named 'Fire'", words: ["BTS", "EXID", "SEVENTEEN", "2NE1"] },
      { groupName: "Has 12 members at debut", words: ["LOONA", "IZ*ONE", "WJSN", "Treasure"] },
      { groupName: "Has one member left the group", words: ["(G)I-DLE", "LE SSERAFIM", "NMIXX", "Stray Kids"] }, 
      { groupName: "Formed as a project group and disbanded", words: ["I.O.I", "Wanna One", "X1", "Mamadol"] },
    ],
  },
];
