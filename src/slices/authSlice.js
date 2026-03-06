import { createSlice } from "@reduxjs/toolkit";


let parsedToken = null;
try {
    const rawToken = localStorage.getItem("token");
    if (rawToken) {
        parsedToken = JSON.parse(rawToken);
    }
} catch (error) {
    // If it's not valid JSON (e.g., a plain string), just use the string itself
    // Some parts of the app might be storing it as a plain string instead of JSON
    parsedToken = localStorage.getItem("token");
}

const initialState = {
    token: parsedToken,
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload
        }
    }
});

export const { setToken, setLoading, setSignupData } = authSlice.actions;
export default authSlice.reducer;