"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { viVN } from "@mui/x-date-pickers/locales";
import { vi } from "date-fns/locale";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export interface CartItem {
  id: string;
  qty: number;
  name: string;
  price: number;
  imgUrl: string;
  slug: string;
}

interface AppState {
  cart: CartItem[];
}

type ActionType = {
  type: "CHANGE_CART_AMOUNT" | "REMOVE";
  payload?: CartItem;
  removedItemIds?: string[];
};

const INITIAL_CART: CartItem[] = [];
const INITIAL_STATE: AppState = {
  cart: INITIAL_CART,
};

const loadCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedCart = sessionStorage.getItem("cart");
    return savedCart ? { cart: JSON.parse(savedCart) } : INITIAL_STATE;
  }
  // return savedCart ? JSON.parse(savedCart) : INITIAL_STATE; // retur
  return INITIAL_STATE;
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: INITIAL_STATE,
  dispatch: () => {},
});

const reducer = (state: AppState, action: ActionType): AppState => {
  let newState: any = {};
  let cartList = state.cart;
  let cartItem = action.payload;

  switch (action.type) {
    case "CHANGE_CART_AMOUNT":
      if (!cartItem) return state;

      let exist = cartList.find((item) => item.id === cartItem.id);
      if (cartItem.qty < 1) {
        const filteredCart = cartList.filter((item) => item.id !== cartItem.id);
        newState = { ...state, cart: filteredCart };
      } else if (exist) {
        const newCart = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, qty: cartItem.qty } : item
        );
        newState = { ...state, cart: newCart };
      } else {
        newState = { ...state, cart: [...cartList, cartItem] };
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("cart", JSON.stringify(newState.cart));
      }

      return newState;
    case "REMOVE":
      const removedItemIds = action.removedItemIds;

      if (removedItemIds) {
        const filteredCart = cartList.filter(
          (item) => !removedItemIds.includes(item.id)
        );
        newState = { ...state, cart: filteredCart };
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("cart", JSON.stringify(newState.cart));
      }

      return newState;
    default: {
      return state;
    }
  }
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(
    reducer,
    INITIAL_STATE,
    loadCartFromStorage
  );
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  useEffect(() => {
    if (state.cart.length > 0) {
      sessionStorage.setItem("cart", JSON.stringify(state.cart));
    }
  }, []);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={vi}
      localeText={
        viVN.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    </LocalizationProvider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContext;
