/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

type SpyObject<T extends {}> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? jasmine.Spy<T[K]> : T[K]
}