import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { AbstractAction, ActionWithPayload, ToContextCallbacks, bindActionCreators } from 'utils/context';

type Props = RouteComponentProps;

type State = {
  count: number;
};

const DEFAULT_STATE: State = {
  count: 0,
};

/*
  flow:
    add action type
    add action creator
    use action creator
    handle action creator in a reducer
*/

type IncrementCountAction = AbstractAction<'INCREMENT_COUNT'>;
type DecrementCountAction = AbstractAction<'DECREMENT_COUNT'>;
type ResetCountAction = AbstractAction<'RESET_COUNT'>;
type SetCountAction = ActionWithPayload<'SET_COUNT', { count: number }>

type Action =
  | IncrementCountAction
  | DecrementCountAction
  | ResetCountAction
  | SetCountAction;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT_COUNT': {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    case 'DECREMENT_COUNT': {
      return {
        ...state,
        count: state.count - 1,
      };
    }
    case 'RESET_COUNT': {
      return {
        ...state,
        count: 0,
      }
    }
    case 'SET_COUNT': {
      return {
        ...state,
        count: action.payload.count,
      }
    }
    default: {
      return state;
    }
  }
}

const incrementCount = (): IncrementCountAction => ({
  type: 'INCREMENT_COUNT',
});

const decrementCount = (): DecrementCountAction => ({
  type: 'DECREMENT_COUNT',
});

const resetCount = (): ResetCountAction => ({
  type: 'RESET_COUNT',
});

const setCount = (payload: SetCountAction['payload']): SetCountAction => ({
  type: 'SET_COUNT',
  payload
});

const stateProviderActionCreators = {
  incrementCount,
  decrementCount,
  resetCount,
  setCount,
};

type StateProviderProps = {};

type StateProviderCallbacks = {
  asyncIncrement(): Promise<any>;
  asyncDecrement(): Promise<any>;
} & ToContextCallbacks<typeof stateProviderActionCreators>;

const StateContext = React.createContext<{
  state: State;
  callbacks: StateProviderCallbacks;
}>(undefined as any);

const StateProvider: React.FC<StateProviderProps> = props => {
  const [state, dispatch] = React.useReducer(reducer, DEFAULT_STATE);

  const asyncIncrement = React.useCallback(async () => {
    await new Promise(resolve => {
      setTimeout(() => {
        dispatch(incrementCount());
        resolve();
      }, 2000);
    });
  }, []);

  const asyncDecrement = React.useCallback(async () => {
    await new Promise(resolve => {
      setTimeout(() => {
        dispatch(decrementCount());
        resolve();
      }, 2000);
    });
  }, []);

  const asyncCallbacks = React.useMemo(() => ({ asyncIncrement, asyncDecrement }), []);

  const callbacks = React.useMemo(() => bindActionCreators(stateProviderActionCreators, dispatch), [
    dispatch,
  ]);

  const contextValue = React.useMemo(
    () => ({ state, callbacks: { ...callbacks, ...asyncCallbacks } }),
    [state],
  );

  return (
    <StateContext.Provider value={contextValue}>{props.children}</StateContext.Provider>
  );
};

export function PageX(_: Props) {
  return (
    <StateProvider>
      <StateContext.Consumer>
        {({ state, callbacks: { incrementCount, decrementCount, setCount, asyncIncrement } }) => (
            <div>
              <div>Count: {state.count}</div>
              <button onClick={incrementCount}>Increment</button>
              <button onClick={decrementCount}>Decrement</button>
              <button onClick={asyncIncrement}>Increment async</button>
              <button onClick={() => setCount({ count: 10 })}>Set 10</button>
            </div>
        )}
      </StateContext.Consumer>
    </StateProvider>
  );
}

/*
  - we may have sync and async operations in react app, so we need an interface that can work with both

   - Once something happens, I fire appropriate action which can change state, can make request, for example
   - also I need somehow track a state of a request, if it's loading or not, maybe I can try regular js and then rewrite using fp-ts using RemoteData, foldl, etc.
*/
