// HTML, CSS, components applied to this file is rendered across all routes. 
// Ideal for persisting a Navigation interface that doesn't rerender.

import { Provider } from "./context/context";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body>{children}</body>
      </Provider>
    </html>
  )
}
