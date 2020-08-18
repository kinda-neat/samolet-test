import React, { useState, useEffect } from 'react';

type Success<R> = { tag: 'SUCCESS'; data: R };
type Loading = { tag: 'LOADING' };
type Fail<E> = { tag: 'FAIL'; error: E };
type NotAsked = { tag: 'NOT_ASKED' };

type RemoteData<R, E = string> = Loading | Success<R> | Fail<E> | NotAsked;

const mkLoading = (): Loading => ({ tag: 'LOADING' });
const mkSuccess = <R extends unknown>(data: R): Success<R> => ({ tag: 'SUCCESS', data });
const mkFail = <E extends unknown>(error: E): Fail<E> => ({ tag: 'FAIL', error });
const mkNotAsked = (): NotAsked => ({ tag: 'NOT_ASKED' });

export function handleRemoteData<R, E>(
  remoteData: RemoteData<R, E>,
  onLoading: () => JSX.Element,
  onSuccess: (data: R) => JSX.Element,
  onFail: (error: E) => JSX.Element,
  onNotAsked: () => JSX.Element,
): JSX.Element {
  switch (remoteData.tag) {
    case 'LOADING': {
      return onLoading();
    }
    case 'SUCCESS': {
      return onSuccess(remoteData.data);
    }
    case 'FAIL': {
      return onFail(remoteData.error);
    }
    case 'NOT_ASKED': {
      return onNotAsked();
    }
  }
}

export function useRemoteData<R, E = string>(fn: () => Promise<R>, deps: any[]): RemoteData<R, E> {
  const [data, setData] = useState<R | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);

  let wasInterrupted = false; // user might go outside the page and a promise will try to change state of unmounted component
  useEffect(() => {
    setIsLoading(true);
    fn()
      .then(data => {
        if (!wasInterrupted) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch(error => {
        if (!wasInterrupted) {
          setError(error);
          setIsLoading(false);
        }
      });
    return () => {
      wasInterrupted = true;
    };
  }, deps);

  if (isLoading) {
    return mkLoading();
  } else if (error !== null) {
    return mkFail(error);
  } else if (data !== null) {
    return mkSuccess(data);
  } else {
    return mkNotAsked();
  }
}
