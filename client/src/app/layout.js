import { Fjalla_One, Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/redux/ReduxProvider";
import VerifyUser from "@/components/verify/VerifyUser";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const fjalla = Fjalla_One({
  variable: "--font-fjalla",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Pick & Go",
  description: "Your convenient online grocery shopping platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReduxProvider>
          <VerifyUser>
            {children}
          </VerifyUser>
        </ReduxProvider>
  
      </body>
    </html>
  );
}