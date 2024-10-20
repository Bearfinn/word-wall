export interface Board {
  path: string;
  name: string;
  description: string;
  wordGroups: WordGroup[];
}

export interface WordItem {
  word: string;
  group: string;
}

export interface WordGroup {
  groupName: string;
  words: string[];
}