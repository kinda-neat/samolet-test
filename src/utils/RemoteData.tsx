import React, { useState, useEffect } from 'react';

type NotAsked = { tag: 'NOT_ASKED' };
type Loading = { tag: 'LOADING' };
type Failure<E> = { tag: 'FAIL'; error: E };
type Success<R> = { tag: 'SUCCESS'; data: R };

export type RemoteData<R, E = string> = Loading | Success<R> | Failure<E> | NotAsked;

export const notAsked: NotAsked = ({ tag: 'NOT_ASKED' });
export const loading: Loading = ({ tag: 'LOADING' });
export const failure = <E extends unknown>(error: E): Failure<E> => ({ tag: 'FAIL', error });
export const success = <R extends unknown>(data: R): Success<R> => ({ tag: 'SUCCESS', data });

export const isNotAsked = <R, E>(x: RemoteData<R, E>): boolean => x.tag === 'NOT_ASKED';
export const isLoading = <R, E>(x: RemoteData<R, E>): boolean => x.tag === 'LOADING';
export const isFailure = <R, E>(x: RemoteData<R, E>): boolean => x.tag === 'FAIL';
export const isSuccess = <R, E>(x: RemoteData<R, E>): boolean => x.tag === 'SUCCESS';

export const doNothing = <T extends any>() => undefined as any;

export function handleRemoteData<R, E, O>(
  remoteData: RemoteData<R, E>,
  onNotAsked: () => O,
  onLoading: () => O,
  onFailure: (error: E) => O,
  onSuccess: (data: R) => O,
): O {
  switch (remoteData.tag) {
    case 'NOT_ASKED': {
      return onNotAsked();
    }
    case 'LOADING': {
      return onLoading();
    }
    case 'FAIL': {
      return onFailure(remoteData.error);
    }
    case 'SUCCESS': {
      return onSuccess(remoteData.data);
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
    return loading;
  } else if (error !== null) {
    return failure(error);
  } else if (data !== null) {
    return success(data);
  } else {
    return notAsked;
  }
}
