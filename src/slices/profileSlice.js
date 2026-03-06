import { createSlice } from "@reduxjs/toolkit";

let initialUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
if (initialUser && initialUser.image && initialUser.image.includes("api.dicebear.com")) {
    initialUser.image = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(initialUser.firstName)}%20${encodeURIComponent(initialUser.lastName)}`;
    localStorage.setItem("user", JSON.stringify(initialUser));
}

const initialState = {
    user: initialUser,
    loading: false,
}

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload
            localStorage.setItem("user", JSON.stringify(value.payload));
        },
        setLoading(state, value) {
            state.loading = value.payload
        },
    }
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;