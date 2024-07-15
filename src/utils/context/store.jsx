import {configureStore} from "@reduxjs/toolkit"
import {persistStore, persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"
import rootReducer from "./rootReducer"
// import logger from 'redux-logger'
// import thunk from 'redux-thunk'

const persistConfig = {
    key : "root",
    storage,
    whitelist: ["auth"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    // middleware: [thunk, logger]
    // middleware: getDefaultMiddleware({
    //     serializableCheck: {
    //       ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
    //     },
    //   }),
})

export const persistor = persistStore(store)