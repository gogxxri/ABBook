import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html { scroll-behavior: smooth; scroll-padding-top: ${({ theme }) => theme.layout.headerHeight}; }

  body {
    margin: 0;
    min-width: 320px;
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    word-break: keep-all;
  }

  h1, h2, h3, h4, p, ul, ol, dl, dd { margin: 0; padding: 0; }
  ul, ol { list-style: none; }
  a { color: inherit; text-decoration: none; }
  button, input, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; border: 0; background: none; padding: 0; }
  img { display: block; max-width: 100%; }

  :focus-visible { outline: 2px solid ${({ theme }) => theme.colors.primary}; outline-offset: 2px; }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }
`;
