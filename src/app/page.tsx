import { App } from "@/components/main-app";
import { AppProvider } from "./contexts/auth-context";

export default function Home() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
