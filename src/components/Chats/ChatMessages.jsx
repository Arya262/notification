import MessageCard from './MessageCard';

const ChatMessages = () => {
  const messages = [
    {
      id: 1,
      image: 'https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg',
      title: 'Table Booking Cancellation Request Received',
      body: 'We have received your cancellation request for your table booking at FOODCHOW on:',
      date: '2025-03-10',
      time: '7:30',
      phone: '+91 525636396',
    },
    {
      id: 2,
      image: 'https://img.freepik.com/free-photo/empty-modern-restaurant-with-wooden-decor_140725-8471.jpg',
      title: 'Your Table Booking is Confirmed!',
      body: 'Thanks for booking with FOODCHOW. Your table reservation is confirmed for:',
      date: '2025-03-15',
      time: '8:00',
      phone: '+91 525636396',
    },
    {
      id: 3,
      image: 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg',
      title: 'Reminder: Your Table Booking',
      body: 'Just a friendly reminder about your upcoming booking at FOODCHOW:',
      date: '2025-03-15',
      time: '8:00',
      phone: '+91 525636396',
    },
    {
      id: 4,
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      title: 'Special Announcement!',
      body: 'Watch this quick video update from FOODCHOW:',
      date: '2025-03-20',
      time: '12:00',
      note: 'We appreciate your continued support.',
      footer: 'Stay tuned for more!',
    },
  ];

  return (
    <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto space-y-4 scrollbar-hide">
      {messages.map((msg) => (
        <MessageCard key={msg.id} {...msg} />
      ))}
    </div>
  );
};

export default ChatMessages;
