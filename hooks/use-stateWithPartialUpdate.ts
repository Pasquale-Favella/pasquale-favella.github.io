import { Dispatch, useReducer } from "react";

export const useStateWithPartialUpdates = <T>(initialState: T): [T, Dispatch<Partial<T>>] => {
    return useReducer(
        (state: T, update: Partial<T>) => ({
            ...state,
            ...update,
        }),
        initialState
    );
}