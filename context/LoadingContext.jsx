import React, { createContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingContextProvider = ({children}) => {
    const [codeViewLoading, setCodeViewLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{codeViewLoading, setCodeViewLoading}}>
            {children}
        </LoadingContext.Provider>
    )
}