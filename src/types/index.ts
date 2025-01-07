export interface Board {
  path: string;
  name: string;
  description: string;
  wordGroups: WordGroup[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WordItem {
  word: string;
  group: string;
}

export interface WordGroup {
  groupName: string;
  words: string[];
}