import { createContext, Dispatch, useContext, useReducer } from "react";
import { Action, EditorState } from "../types/utils";

export const EditorContext = createContext(
  {} as {
    state: EditorState;
    dispatch: Dispatch<Action>;
  }
);
