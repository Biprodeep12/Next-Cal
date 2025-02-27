import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Plus, Trash2 } from 'lucide-react';

export default function Main() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState<{ [key: string]: string[] }>({});
  const [newEvent, setNewEvent] = useState('');
  const [alert, setAlert] = useState(false);
  const [event, setEvent] = useState('');

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');

  const startDay = startOfMonth.startOf('week');
  const endDay = endOfMonth.endOf('week');

  const days = useMemo(() => {
    const tempDays = [];
    let day = startDay.clone();
    while (day.isBefore(endDay, 'day')) {
      tempDays.push(day);
      day = day.add(1, 'day').clone();
    }
    return tempDays;
  }, [currentDate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsData: { [key: string]: string[] } = {};

        querySnapshot.forEach((doc) => {
          eventsData[doc.id] = doc.data().events || [];
        });

        console.log('Fetched events:', eventsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDayClick = (day: dayjs.Dayjs) => {
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
    setAlert(true);
    setEvent('Event Added');
    setTimeout(() => {
      setAlert(false);
    }, 3000);
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
    setAlert(true);
    setEvent('Event Removed');
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };

  return (
    <>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[470px] bg-[#231651] rounded-[30px] flex flex-row overflow-hidden main'>
        <div className='max-w-[450px] min-w-[450px] w-screen h-[470px] m-[10px] rounded-[30px] bg-[#d6fff6] py-5 px-4 shadow-lg calo'>
          <div className='grid grid-cols-[70%,15%,15%] items-center mb-6'>
            <h1 className='text-2xl font-bold ml-4'>
              {currentDate.format('MMMM YYYY')}
            </h1>
            <button
              onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
              className='p-2 bg-gray-200 rounded-full w-[45px] hover:bg-gray-300'>
              ◀
            </button>
            <button
              onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
              className='p-2 bg-gray-200 rounded-full w-[45px] hover:bg-gray-300'>
              ▶
            </button>
          </div>

          <div className='grid grid-cols-7 text-center font-semibold'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className='p-1'>
                {day}
              </div>
            ))}
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

        <div className='py-4 px-2 flex flex-col ent ent'>
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
              <ul className='text-[#d6fff6] flex flex-col gap-1 overflow-scroll overflow-x-hidden max-h-[300px] custom-scrollbar'>
                {events[selectedDate.format('YYYY-MM-DD')].map(
                  (event, index) => (
                    <li
                      key={index}
                      className='bg-[#d6fff6] text-[#231651] p-2 rounded-md my-1 flex justify-between items-center kalo'>
                      <span>{event}</span>
                      <button
                        onClick={() => removeEvent(event)}
                        className='ml-2 text-[#231651] p-1 rounded-md text-sm'>
                        <Trash2 />
                      </button>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className='text-gray-400'>No events</p>
            )}
          </div>
        </div>
      </div>
      {alert && (
        <div className='p-2 text-xl font-bold fixed left-1/2 -translate-x-1/2  bg-[#231651] text-[#d6fff6] rounded-[5px] alert'>
          {event}
        </div>
      )}
    </>
  );
}
