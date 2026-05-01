import { createClient } from "@/lib/client";

export const authApi = {
  getSession: async () => {
    const supabase = createClient();
    return await supabase.auth.getUser();
  },
  login: (email: string, password: string) => createClient().auth.signInWithPassword({ email, password }),
  logout: () => createClient().auth.signOut(),
};
