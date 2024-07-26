import {
  createContext,
  useContext,
  SetStateAction,
  Dispatch,
  useState,
} from "react";

type RouteContextProps = {
  children: React.ReactNode;
};
type State = {
  activePath: string;
  setActivePath: Dispatch<SetStateAction<string>>;
};

const Context = createContext<State | undefined>(undefined);
export const RouteContext = ({ children }: RouteContextProps) => {
  const [activePath, setActivePath] = useState("home");
  const state: State = {
    activePath,
    setActivePath,
  };
  return <Context.Provider value={state}>{children}</Context.Provider>;
};
export const useRouteContext = (): State => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Context must be used within context provider");
  }
  return context;
};
