import {configureStore} from "@reduxjs/toolkit"
import {persistStore, persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"
import rootReducer from "./rootReducer"
// import logger from 'redux-logger'
// import thunk from 'redux-thunk'

const persistConfig = {
    key : "root",
    storage,
    whitelist: ["auth", "adminAuth"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register', 'rehydrate']
            }
        })
})

const persistor = persistStore(store)

export {store, persistor}