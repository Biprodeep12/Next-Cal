import { Calendar } from 'lucide-react';

export default function Nav() {
  return (
    <div className='w-full h-[100px] absolute top-0 nav'>
      <div className='absolute top-1/2 left-[50px] -translate-y-1/2 font-bold text-[45px] text-[#231651] flex items-center gap-5 text-nowrap logo'>
        Public Calendar
        <Calendar size={40} color='#231651' />
      </div>
    </div>
  );
}
