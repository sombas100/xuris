import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <main>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </main>
  );
}

export default App;
