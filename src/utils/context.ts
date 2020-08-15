
export type AbstractAction<T> = {
  type: T;
};

export type ActionWithPayload<T, P extends Record<string, any>> = {
  type: T;
  payload: P;
};

type FunctionArgs<T> = T extends (...args: infer R) => any ? R : unknown;
type ReturnValue<T> = T extends (...args: any[]) => infer R ? R : unknown;

export type ToContextCallbacks<T extends { [name: string]: (...args: any[]) => any }> = {
  [P in keyof T]: (...args: FunctionArgs<T[P]>) => any;
};

export function bindActionCreators<A, T extends { [name: string]: (...args: any[]) => any }>(
  map: T,
  dispatch: React.Dispatch<A>,
): ToContextCallbacks<T> {
  return Object.entries(map).reduce(
    (acc, [methodName, actionCreator]) => ({
      ...acc,
      [methodName]: x => dispatch(actionCreator(x)),
    }),
    {} as ToContextCallbacks<T>,
  );
}
