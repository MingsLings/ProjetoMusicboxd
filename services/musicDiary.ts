import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { MusicLog, MusicLogInput } from '../types';
import { db } from './firebase';

const logsCollection = collection(db, 'musicLogs');

function toMusicLog(id: string, data: Record<string, unknown>): MusicLog {
  const listenedAt = data.listenedAt instanceof Timestamp
    ? data.listenedAt.toDate()
    : new Date(String(data.listenedAt ?? Date.now()));
  const createdAt = data.createdAt instanceof Timestamp
    ? data.createdAt.toDate()
    : new Date();

  return {
    id,
    userId: String(data.userId ?? ''),
    title: String(data.title ?? ''),
    artist: String(data.artist ?? ''),
    rating: Number(data.rating ?? 0),
    listenedAt,
    review: String(data.review ?? ''),
    createdAt,
  };
}

export async function registrarAudicao(input: MusicLogInput) {
  const reference = await addDoc(logsCollection, {
    ...input,
    title: input.title.trim(),
    artist: input.artist.trim(),
    review: input.review.trim(),
    listenedAt: Timestamp.fromDate(input.listenedAt),
    createdAt: serverTimestamp(),
  });

  return reference.id;
}

export function observarDiarioMusical(
  userId: string,
  onChange: (logs: MusicLog[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    query(logsCollection, where('userId', '==', userId)),
    (snapshot) => {
      const logs = snapshot.docs
        .map((item) => toMusicLog(item.id, item.data()))
        .sort((first, second) => second.listenedAt.getTime() - first.listenedAt.getTime());
      onChange(logs);
    },
    onError,
  );
}

export async function excluirRegistroMusical(id: string, userId: string) {
  const reference = doc(db, 'musicLogs', id);
  const snapshot = await getDoc(reference);

  if (!snapshot.exists() || snapshot.data().userId !== userId) {
    throw new Error('Registro não encontrado ou sem permissão para excluir.');
  }

  await deleteDoc(reference);
}
