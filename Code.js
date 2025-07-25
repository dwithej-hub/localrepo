import React, { useState } from "react";
import { addDays, format } from "date-fns";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function RecurringEventScheduler() {
  const [startDate, setStartDate] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [occurrences, setOccurrences] = useState(5);
  const [viewStart, setViewStart] = useState("");
  const [viewEnd, setViewEnd] = useState("");
  const [instances, setInstances] = useState<string[]>([]);

  const generateInstances = () => {
    if (!startDate || !viewStart || !viewEnd || occurrences <= 0) return;

    const start = new Date(startDate);
    const dayOfWeek = weekdays.indexOf(selectedDay);
    const results = [];

    // Find the first occurrence of the selected weekday on or after start date
    let current = new Date(start);
    while (current.getDay() !== dayOfWeek) {
      current = addDays(current, 1);
    }

    for (let i = 0; i < occurrences; i++) {
      results.push(new Date(current));
      current = addDays(current, 7); // weekly recurrence
    }

    // Filter by view window
    const viewStartDate = new Date(viewStart);
    const viewEndDate = new Date(viewEnd);
    const filtered = results
      .filter(date => date >= viewStartDate && date <= viewEndDate)
      .map(date => format(date, "yyyy-MM-dd"));

    setInstances(filtered);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 shadow-xl border rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Recurring Event Generator</h2>

      <div className="space-y-2">
        <label className="block font-medium">Start Date:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border px-2 py-1 rounded" />

        <label className="block font-medium">Day of Week:</label>
        <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} className="w-full border px-2 py-1 rounded">
          {weekdays.map(day => (
            <option key={day}>{day}</option>
          ))}
        </select>

        <label className="block font-medium">Number of Occurrences:</label>
        <input type="number" value={occurrences} onChange={e => setOccurrences(parseInt(e.target.value))} className="w-full border px-2 py-1 rounded" />

        <label className="block font-medium">View Window Start:</label>
        <input type="date" value={viewStart} onChange={e => setViewStart(e.target.value)} className="w-full border px-2 py-1 rounded" />

        <label className="block font-medium">View Window End:</label>
        <input type="date" value={viewEnd} onChange={e => setViewEnd(e.target.value)} className="w-full border px-2 py-1 rounded" />

        <button
          onClick={generateInstances}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generate Instances
        </button>
      </div>

      {instances.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Instances within view window:</h3>
          <ul className="list-disc pl-5">
            {instances.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
