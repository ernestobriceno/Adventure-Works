"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuth, logout } from "@/firebase";


type AuthCtx = { user: User | null; loading: boolean; signOut: () => Promise<void>; };
const Ctx = createContext<AuthCtx | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
const unsub = onAuth((u) => { setUser(u); setLoading(false); });
return () => unsub();
}, []);
return <Ctx.Provider value={{ user, loading, signOut: logout }}>{children}</Ctx.Provider>;
};


export function useAuth() {
const ctx = useContext(Ctx);
if (!ctx) throw new Error("useAuth must be used within AuthProvider");
return ctx;
}