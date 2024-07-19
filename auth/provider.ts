/** @format */
interface ProviderConfig {}

export class BaseProvider {
  name: string;

  constructor(name: string, config: ProviderConfig) {
    this.name = name;
  }
}
