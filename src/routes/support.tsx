import { createFileRoute } from "@tanstack/react-router";

import ContactPage, { Route as ContactRoute } from "./contact";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: ContactRoute.options?.head,
});

function SupportPage() {
  return <ContactPage />;
}
