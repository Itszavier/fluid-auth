import { BaseSessionData, BaseSessionStore } from ".";

export class MemoryStore extends BaseSessionStore {
  data = new Map<string, BaseSessionData>();
  constructor() {
    super();
  }

  async saveSession(id: string, session: BaseSessionData): Promise<void> {
    console.log(`[MemoryStore] saving session with ID: ${id}`);
    this.data.set(id, session);
    console.log(`[MemoryStore] Data after create:`, this.data);
  }

  async getSession(sessionId: string): Promise<BaseSessionData | null> {
    console.log(`[MemoryStore] getting session with ID: ${sessionId}`);
    const data = this.data.get(sessionId);
    console.log(`[MemoryStore] sessionData after:`, this.data);
    return data || null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    console.log(`[MemoryStore] Deleting session with ID: ${sessionId}`);
    this.data.delete(sessionId);
    console.log(`[MemoryStore] Data after delete:`, this.data);
  }
}
