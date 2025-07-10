// HTML, CSS, components applied to this file is rendered across all routes. 
// Ideal for persisting a Navigation interface that doesn't rerender.
'use client'
import { TideCloakProvider } from "@tidecloak/nextjs"
import tcConfig from "../tcConfig.json"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TideCloakProvider config={tcConfig}>
          {children}
        </TideCloakProvider>
      </body>
    </html>
  )
}
