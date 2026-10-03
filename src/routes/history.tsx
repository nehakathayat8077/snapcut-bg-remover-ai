import { createFileRoute, redirect } from "@tanstack/react-router";

import { supabase } from "@/lib/supabase";

import DashboardPage from "./dashboard";

export const Route = createFileRoute("/history")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});
