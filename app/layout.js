// HTML, CSS, components applied to this file is rendered across all routes. 
// Ideal for persisting a Navigation interface that doesn't rerender.

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
