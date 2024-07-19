/** @format */

export class BaseProvider {
  name: string;
  config: any;

  
  constructor(name: string, config: any) {
    this.name = name;
    this.config = config;
  }
}
