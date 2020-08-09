import React, { useEffect, useState } from 'react';

type UseApiResult<T> = [boolean, T, unknown];

export function useApi<T>(call: () => Promise<T>, deps: any[]): UseApiResult<T | undefined>;
export function useApi<T>(call: () => Promise<T>, deps: any[], defaultValue: T): UseApiResult<T>;
export function useApi<T>(
  call: () => Promise<T>,
  deps: any[],
  defaultValue?: T,
): UseApiResult<T | undefined> {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  let wasInterrupted = false; // user might go outside the page and a promise will try to change state of unmounted component
  useEffect(() => {
    setIsLoading(true);
    call()
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
  return [isLoading, data as any, error];
}
