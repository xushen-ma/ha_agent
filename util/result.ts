type Success<T> = {
    error: false;
    value: T;
};

type Failure<U> = {
    error: true;
    value: U;
};

export type Result<T, U> = Success<T> | Failure<U>;

export const success = <T>(value: T): Success<T> => ({
    error: false,
    value
});

export const failure = <T>(value: T): Failure<T> => ({
    error: true,
    value
});