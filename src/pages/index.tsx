import { useState } from 'react';
import Main from './components/Main';
import Nav from './components/Nav';

export default function Home() {
  const [theme, setTheme] = useState({ accent: '#231651', bg: '#d6fff6' });

  const themes = [
    { bg: '#DFE8E6', accent: '#A0430A' },
    { bg: '#d6fff6', accent: '#231651' },
    { bg: '#EFDFBB', accent: '#722F37' },
    { bg: '#EFE9E0', accent: '#0F9E99' },
    { bg: '#EEE5DA', accent: '#262424' },
  ];

  const handleThemeChange = (themeIndex: number) => {
    setTheme(themes[themeIndex]);
  };

  return (
    <>
      <Nav onThemeChange={handleThemeChange} theme={theme} />
      <Main theme={theme} />
    </>
  );
}
