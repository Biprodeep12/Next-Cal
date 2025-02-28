import { useState, useEffect } from 'react';
import Main from './components/Main';
import Nav from './components/Nav';

export default function Home() {
  const [theme, setTheme] = useState<{ bg: string; accent: string } | null>(
    null,
  );
  const themes = [
    { bg: '#DFE8E6', accent: '#A0430A' },
    { bg: '#d6fff6', accent: '#231651' },
    { bg: '#EFDFBB', accent: '#722F37' },
    { bg: '#EFE9E0', accent: '#0F9E99' },
    { bg: '#EEE5DA', accent: '#262424' },
  ];

  useEffect(() => {
    setTheme({ accent: '#231651', bg: '#d6fff6' });
  }, []);

  const handleThemeChange = (themeIndex: number) => {
    setTheme(themes[themeIndex]);
  };

  if (!theme) return null;

  return (
    <>
      <Nav onThemeChange={handleThemeChange} theme={theme} />
      {theme && <Main theme={theme} />}
    </>
  );
}
