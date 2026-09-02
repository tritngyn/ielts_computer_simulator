import { IeltsReadingTest } from "../types/ielts";
import { IeltsListeningTest } from "../types/listening";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getAllReadingTests(): Promise<IeltsReadingTest[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/tests/reading`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching reading tests:", error);
    return [];
  }
}

export async function getReadingTestById(id: string): Promise<IeltsReadingTest | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/tests/reading/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error("Error fetching test by ID:", error);
    return null;
  }
}

export async function getAllListeningTests(): Promise<IeltsListeningTest[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/tests/listening`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching listening tests:", error);
    return [];
  }
}

export async function getListeningTestById(id: string): Promise<IeltsListeningTest | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/tests/listening/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error("Error fetching listening test by ID:", error);
    return null;
  }
}

