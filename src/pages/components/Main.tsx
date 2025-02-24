import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Plus, Trash2 } from 'lucide-react';

export default function Main() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState<{ [key: string]: string[] }>({});
  const [newEvent, setNewEvent] = useState('');

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');

  const startDay = startOfMonth.startOf('week');
  const endDay = endOfMonth.endOf('week');

  const days = [];
  let day = startDay;
  while (day.isBefore(endDay, 'day')) {
    days.push(day);
    day = day.add(1, 'day');
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsData: { [key: string]: string[] } = {};
      eventsSnapshot.forEach((doc) => {
        eventsData[doc.id] = doc.data().events;
      });
      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  const handleDayClick = (day: any) => {
    setSelectedDate(day);
  };

  const addEvent = async () => {
    if (!newEvent.trim()) return;
    const formattedDate = selectedDate.format('YYYY-MM-DD');

    const updatedEvents = {
      ...events,
      [formattedDate]: [...(events[formattedDate] || []), newEvent],
    };

    setEvents(updatedEvents);
    setNewEvent('');

    await setDoc(doc(db, 'events', formattedDate), {
      events: updatedEvents[formattedDate],
    });
  };

  const removeEvent = async (eventToRemove: string) => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    const updatedEvents = events[formattedDate]?.filter(
      (event) => event !== eventToRemove,
    );

    setEvents({
      ...events,
      [formattedDate]: updatedEvents || [],
    });

    if (updatedEvents?.length > 0) {
      await setDoc(doc(db, 'events', formattedDate), {
        events: updatedEvents,
      });
    } else {
      await setDoc(doc(db, 'events', formattedDate), {
        events: [],
      });
    }
  };

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#231651] rounded-[30px] flex flex-row'>
      <div className='w-[450px] m-[10px] rounded-[30px] bg-[#d6fff6] py-5 px-4 shadow-lg'>
        <div className='grid grid-cols-[70%,15%,15%] items-center mb-10'>
          <h2 className='text-xl font-bold ml-4'>
            {currentDate.format('MMMM YYYY')}
          </h2>
          <button
            onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
            className='p-2 bg-gray-200 rounded-full w-[45px]'>
            ◀
          </button>
          <button
            onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
            className='p-2 bg-gray-200 rounded-full w-[45px]'>
            ▶
          </button>
        </div>

        <div className='grid grid-cols-7 text-center'>
          {days.map((day, index) => {
            const formattedDate = day.format('YYYY-MM-DD');
            const eventList = events[formattedDate] || [];

            const eventColors = [
              'bg-red-500',
              'bg-blue-500',
              'bg-green-500',
              'bg-yellow-500',
            ];

            return (
              <div
                key={index}
                className={`flex justify-center items-center relative h-[50px] p-2 rounded-md m-1 hover:bg-[#aba5c5] hover:text-[#d6fff6] cursor-pointer transition-all ${
                  day.isSame(currentDate, 'month') ? '' : 'text-gray-400'
                } ${
                  day.isSame(dayjs(), 'day')
                    ? 'bg-[#231651] text-[#d6fff6]'
                    : ''
                }
          ${
            day.isSame(selectedDate, 'day')
              ? 'border-2 border-blue-500'
              : 'border-2 border-[#d6fff6]'
          }
        `}
                onClick={() => handleDayClick(day)}>
                {day.format('D')}

                <div className='absolute bottom-[4px] left-1/2 -translate-x-1/2 flex  flex-nowrap justify-center'>
                  {eventList.slice(0, 4).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 ${
                        eventColors[i % eventColors.length]
                      } rounded-full`}></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='py-4 px-2 flex flex-col '>
        <h1 className='text-[#d6fff6] text-[30px] mb-2'>Events</h1>
        <h2 className='text-[#d6fff6] text-lg mb-2'>
          {selectedDate.format('MMMM D, YYYY')}
        </h2>

        <div className='flex'>
          <input
            type='text'
            placeholder='Add event...'
            className='p-2 rounded-md w-[250px]'
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
          <button
            onClick={addEvent}
            className='ml-2 bg-[#d6fff6] text-[#231651] p-2 rounded-md'>
            <Plus />
          </button>
        </div>

        <div className='mt-4'>
          {events[selectedDate.format('YYYY-MM-DD')]?.length > 0 ? (
            <ul className='text-[#d6fff6] flex flex-col gap-1 overflow-scroll overflow-x-hidden h-[300px] custom-scrollbar'>
              {events[selectedDate.format('YYYY-MM-DD')].map((event, index) => (
                <li
                  key={index}
                  className='bg-[#d6fff6] text-[#231651] p-2 rounded-md my-1 flex justify-between items-center'>
                  <span>{event}</span>
                  <button
                    onClick={() => removeEvent(event)}
                    className='ml-2 text-[#231651] p-1 rounded-md text-sm'>
                    <Trash2 />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-400'>No events</p>
          )}
        </div>
      </div>
    </div>
  );
}
