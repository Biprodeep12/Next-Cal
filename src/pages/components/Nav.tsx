import { Calendar } from 'lucide-react';

interface NavProps {
  onThemeChange: (themeIndex: number) => void;
  theme: { bg: string; accent: string }; // Move `theme` inside NavProps
}

export default function Nav({ onThemeChange, theme }: NavProps) {
  return (
    <>
      <div
        className='fixed w-full h-full'
        style={{ backgroundColor: theme.bg }}></div>
      <div className='w-full h-[100px] absolute top-0 nav'>
        <div
          className='absolute top-1/2 left-[50px] -translate-y-1/2 font-bold text-[45px] flex items-center gap-5 text-nowrap logo'
          style={{ color: theme.accent }}>
          Public Calendar
          <Calendar size={40} color={theme.accent} />
        </div>
      </div>
      <div className='absolute right-[20px] top-[20px] rounded-lg flex flex-col gap-[10px] p-[7px] bg-white border-[#231651] border-[2px] cursor-pointer boh'>
        {[
          ['#DFE8E6', '#A0430A'],
          ['#d6fff6', '#231651'],
          ['#EFDFBB', '#722F37'],
          ['#EFE9E0', '#0F9E99'],
          ['#EEE5DA', '#262424'],
        ].map(([color1, color2], index) => (
          <div
            key={index}
            className='w-[50px] h-[50px] rounded grid grid-cols-2 overflow-hidden cursor-pointer'
            onClick={() => onThemeChange(index)}>
            <div style={{ backgroundColor: color1 }}></div>
            <div style={{ backgroundColor: color2 }}></div>
          </div>
        ))}
      </div>
    </>
  );
}
