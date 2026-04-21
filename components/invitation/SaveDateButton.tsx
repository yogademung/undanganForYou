'use client';

import { motion } from 'framer-motion';

interface SaveDateButtonProps {
  title: string;
  date: Date | string;
  location: string;
  description: string;
}

export default function SaveDateButton({ title, date, location, description }: SaveDateButtonProps) {
  const handleSaveDate = () => {
    const eventDate = new Date(date);
    
    // Format date for ICS (YYYYMMDDTHHMMSSZ)
    const formatDate = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const startDate = formatDate(eventDate);
    const endDate = formatDate(new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)); // Default 2 hours

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `URL:${typeof window !== 'undefined' ? window.location.href : ''}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wedding-event.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(212, 160, 23, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSaveDate}
      className="mt-8 flex items-center justify-center gap-3 px-8 py-3 bg-white border-2 border-[var(--color-gold)] text-[var(--color-gold)] font-bold rounded-full transition-all duration-300 hover:bg-[var(--color-gold)] hover:text-white shadow-lg group"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2} 
        stroke="currentColor" 
        className="w-5 h-5 transition-transform group-hover:rotate-12"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
      <span className="font-inter tracking-wide uppercase text-sm">Simpan Tanggal</span>
    </motion.button>
  );
}
