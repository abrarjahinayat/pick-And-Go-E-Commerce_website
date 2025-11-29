import { configureStore } from '@reduxjs/toolkit'
import { userinfo } from './slices/userSlice'

export const store = configureStore({
  reducer: {
    userinfo
  },
})