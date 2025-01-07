import { createClient } from '@libsql/client';
import { Board } from '../types';

const client = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_DATABASE_TOKEN,
});

export async function getBoards() {
  const { rows } = await client.execute(`SELECT * FROM boards`);
  return rows.map(row => ({
    path: row.path,
    name: row.name,
    description: row.description,
    wordGroups: JSON.parse(row.word_groups as string),
  })) as Board[];
}

export async function getBoardByPath(path: string) {
  const { rows } = await client.execute({
    sql: `SELECT * FROM boards WHERE path = ?`,
    args: [path],
  });
  
  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  return {
    path: row.path,
    name: row.name,
    description: row.description,
    wordGroups: JSON.parse(row.word_groups as string),
  } as Board;
}

export async function addBoard(board: Board) {
  try {
    await client.execute({
      sql: `INSERT INTO boards (path, name, description, word_groups, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [board.path, board.name, board.description, JSON.stringify(board.wordGroups), new Date().toISOString(), new Date().toISOString()],
    });
    return true;
  } catch (error) {
    console.error('Error adding board:', error);
    return false;
  }
}