import { redirect } from "next/navigation";

// Old route — landing now lives at /
export default function LandingRedirect() {
  redirect("/");
}
