import { BaseSessionData, BaseSessionStore } from ".";

export class MemoryStore extends BaseSessionStore {
  data = new Map<string, BaseSessionData>();
  constructor() {
    super();
  }

  async createSession(id: string, session: BaseSessionData): Promise<void> {
    this.data.set(id, session);
    console.log("data after create", this.data);
  }

  async getSession(sessionId: string): Promise<BaseSessionData | null> {
    return this.data.get(sessionId) || null;
  }

  async deleteSession(sessionId: string): Promise<void> {}
}
