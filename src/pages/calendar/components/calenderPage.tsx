import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useBreezeHooks from '@/hooks/useBreezeHooks'



const CalendarPage: React.FC = () => {
   const {tasks, fetchAllTasks } = useBreezeHooks();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
   useEffect(() => {
      fetchAllTasks();
    }, []);

  // const events = [
  //   { id: 1, title: "Team Meeting", date: "2025-01-28", time: "10:00" },
  //   { id: 2, title: "Project Review", date: "2025-01-28", time: "14:00" },
  //   { id: 3, title: "Client Call", date: "2025-01-30", time: "11:00" }
  // ];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthData = (): (number | null)[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks?.filter(event => event.dueDate === dateStr);
  };

  const nextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  return (
    <>
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex gap-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
  
      {/* Calendar Layout */}
      <div className="hidden md:grid grid-cols-7 gap-4">
        {/* Desktop & Tablet: Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
  
        {/* Days of the Month */}
        {getMonthData().map((day, index) => (
          <div key={index} className="min-h-32 border rounded-lg p-2">
            {day && (
              <>
                <div className="text-right text-gray-500 mb-2">{day}</div>
                <div className="space-y-2">
                  {(() => {
                    const events = getEventsForDay(day);
                    if (events && events.length > 1) {
                      return (
                        <div className="relative group">
                          <div className="bg-yellow-100 p-1 rounded text-xs cursor-pointer">
                            Multiple Tasks
                          </div>
  
                          <div className="absolute hidden group-hover:block z-10 bg-white border border-gray-200 shadow-lg p-2 rounded-lg w-48 -left-1/2 transform -translate-x-1/2 max-h-40 overflow-y-auto">
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-200"></div>
  
                            {events.map((event) => (
                              <div key={event._id} className="bg-blue-100 p-2 rounded text-sm mb-2">
                                <div className="font-medium">{event.title}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else if (events && events.length === 1) {
                      const event = events[0];
                      return (
                        <div key={event._id} className="bg-blue-100 p-2 rounded text-sm">
                          <div className="font-medium">{event.title}</div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })()}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
  
      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {getMonthData().map((day, index) => (
          day && (
            <div key={index} className="border rounded-lg p-4 flex flex-col">
              <div className="text-gray-500 font-medium">{day}</div>
              <div className="mt-2 space-y-2">
                {(() => {
                  const events = getEventsForDay(day);
                  if (events && events.length > 1) {
                    return (
                      <details className="bg-yellow-100 p-2 rounded cursor-pointer">
                        <summary className="text-xs">Multiple Tasks</summary>
                        <div className="bg-white border border-gray-200 shadow-lg p-2 rounded-lg max-h-40 overflow-y-auto mt-2">
                          {events.map((event) => (
                            <div key={event._id} className="bg-blue-100 p-2 rounded text-sm mb-2">
                              <div className="font-medium">{event.title}</div>
                            </div>
                          ))}
                        </div>
                      </details>
                    );
                  } else if (events && events.length === 1) {
                    const event = events[0];
                    return (
                      <div key={event._id} className="bg-blue-100 p-2 rounded text-sm">
                        <div className="font-medium">{event.title}</div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  </>
  
  );
};

export default CalendarPage;