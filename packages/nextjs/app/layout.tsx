import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldMoveAppWithProviders } from "~~/components/ScaffoldMoveAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-move/getMetadata";

export const metadata = getMetadata({
  title: "Scaffold-Move App",
  description: "Built with 🏗 Scaffold-Move",
});

const ScaffoldMoveApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem={false} defaultTheme="dark">
          <ScaffoldMoveAppWithProviders>{children}</ScaffoldMoveAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldMoveApp;
