// app/+html.jsx

import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#00FF00" />
        <link rel="manifest" href="/manifest.json" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192.png"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="楊承祐的小遊戲" />
        <title>楊承祐的小遊戲</title>
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html,
              body,
              #root {
                width: 100%;
                height: 100%;
                min-height: 100%;
                margin: 0;
                padding: 0;
                background-color: #ffffff;
              }

              body {
                min-height: 100vh;
                min-height: 100dvh;
                overscroll-behavior-y: none;
                -webkit-tap-highlight-color: transparent;
              }

              #root {
                min-height: 100vh;
                min-height: 100dvh;
              }
            `,
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
