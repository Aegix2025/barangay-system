import React, { useState } from 'react';
import { Megaphone, Calendar, MapPin, Clock, Plus, X, Users, AlertCircle, Heart, Shield } from 'lucide-react';
import { Announcement, BarangayEvent } from '../types';

interface Props {
  announcements: Announcement[];
  events: BarangayEvent[];
  onAddAnnouncement: (a: Announcement) => void;
  onAddEvent: (e: BarangayEvent) => void;
}

export const AnnouncementsEvents: React.FC<Props> = ({
  announcements,
  events,
  onAddAnnouncement,
  onAddEvent
}) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'events'>('announcements');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    category: 'Advisory' as Announcement['category'],
    target_purok: 'All'
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: 'Nestor Nabaunag Covered Court',
    event_date: '2026-08-20',
    event_time: '9:00 AM',
    organizer: 'Barangay SF II Council'
  });

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAnnouncement({
      ...newAnn,
      announcement_id: `ANN-${String(announcements.length + 1).padStart(3, '0')}`,
      date_posted: new Date().toISOString().split('T')[0],
      posted_by: 'Barangay SF II Admin'
    });
    setIsModalOpen(false);
    setNewAnn({ title: '', content: '', category: 'Advisory', target_purok: 'All' });
  };

  const handleEvtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent({
      ...newEvent,
      event_id: `EVT-${String(events.length + 1).padStart(3, '0')}`,
      status: 'Upcoming'
    });
    setIsModalOpen(false);
    setNewEvent({
      title: '',
      description: '',
      location: 'Nestor Nabaunag Covered Court',
      event_date: '2026-08-20',
      event_time: '9:00 AM',
      organizer: 'Barangay SF II Council'
    });
  };

  // Sample events data
  const sampleEvents: BarangayEvent[] = [
    {
      event_id: 'EVT-001',
      title: 'Medical Mission and Free Check-up',
      description: 'Free medical consultation, dental check-up, and medicine distribution for all residents. Bring your health cards and IDs.',
      location: 'Nestor Nabaunag Covered Court',
      event_date: '2026-08-20',
      event_time: '8:00 AM - 3:00 PM',
      organizer: 'Barangay Health Center',
      status: 'Upcoming'
    },
    {
      event_id: 'EVT-002',
      title: 'Youth Basketball Tournament',
      description: 'Inter-purok basketball competition for ages 15-21. Registration is ongoing at the Barangay Hall.',
      location: 'Nestor Nabaunag Covered Court',
      event_date: '2026-08-25',
      event_time: '6:00 AM - 8:00 PM',
      organizer: 'SK Barangay SF II',
      status: 'Upcoming'
    },
    {
      event_id: 'EVT-003',
      title: 'Clean-up Drive and Tree Planting',
      description: 'Community-wide clean-up drive followed by tree planting along the barangay roads. Please bring your own gloves and tools.',
      location: 'Barangay SF II Proper',
      event_date: '2026-08-28',
      event_time: '6:00 AM - 12:00 PM',
      organizer: 'Barangay Environment Committee',
      status: 'Upcoming'
    },
    {
      event_id: 'EVT-004',
      title: 'Feast of the Barangay Patron Saint',
      description: 'Annual celebration featuring a mass, parade, and community dinner. All residents are invited to participate.',
      location: 'Nestor Nabaunag Covered Court',
      event_date: '2026-09-05',
      event_time: '5:00 PM - 10:00 PM',
      organizer: 'Barangay SF II Council',
      status: 'Upcoming'
    },
    {
      event_id: 'EVT-005',
      title: 'Livelihood Skills Training',
      description: 'Free seminar on baking, dressmaking, and small business management. Limited slots available, register early.',
      location: 'Barangay Hall Multi-purpose Hall',
      event_date: '2026-09-10',
      event_time: '9:00 AM - 4:00 PM',
      organizer: 'DSWD & Barangay Livelihood Office',
      status: 'Upcoming'
    },
    {
      event_id: 'EVT-006',
      title: 'Zumba Fitness Program',
      description: 'Weekly fitness session for all residents. Help promote a healthy lifestyle in our community.',
      location: 'Nestor Nabaunag Covered Court',
      event_date: '2026-08-22',
      event_time: '6:00 PM - 7:30 PM',
      organizer: 'Barangay Health and Wellness Committee',
      status: 'Upcoming'
    }
  ];

  const allEvents = [...events, ...sampleEvents];

  const categoryIcons = {
    'Urgent': <AlertCircle className="w-3.5 h-3.5" />,
    'Advisory': <Megaphone className="w-3.5 h-3.5" />,
    'Health': <Heart className="w-3.5 h-3.5" />,
    'Safety': <Shield className="w-3.5 h-3.5" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-700 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-cyan-400" />
            <span>Announcements & Barangay SF II Programs</span>
          </h2>
          <p className="text-xs text-gray-700 mt-0.5">
            Community Advisories, Health Missions, and SK Youth Events (Nestor Nabaunag, Limay)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'announcements' ? 'Add Announcement' : 'Add Event'}</span>
          </button>
        </div>
      </div>

      {/* Nav Switch */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'announcements'
              ? 'bg-cyan-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'events'
              ? 'bg-cyan-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Events & Activities ({allEvents.length})
        </button>
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((a) => (
            <div key={a.announcement_id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center text-xs">
                <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 ${
                  a.category === 'Urgent' ? 'bg-red-100 text-red-800' :
                  a.category === 'Health' ? 'bg-cyan-100 text-cyan-800' :
                  a.category === 'Safety' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {categoryIcons[a.category as keyof typeof categoryIcons]}
                  {a.category} • {a.target_purok}
                </span>
                <span className="text-gray-400 text-[11px]">{a.date_posted}</span>
              </div>

              <h3 className="font-bold text-base text-gray-700">{a.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{a.content}</p>

              <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                Posted by: {a.posted_by}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allEvents.map((e) => (
            <div key={e.event_id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center text-xs">
                <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 ${
                  e.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                  e.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <Calendar className="w-3 h-3" />
                  {e.status} Event
                </span>
                <span className="text-gray-500 font-bold">{e.event_date}</span>
              </div>

              <h3 className="font-bold text-base text-gray-700 flex items-start gap-2">
                <Calendar className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                {e.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed pl-6">{e.description}</p>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {e.location}</p>
                <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {e.event_time}</p>
                <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-400" /> Organizer: {e.organizer}</p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full">Open to all</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Register now</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-cyan-500 text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {activeTab === 'announcements' ? 'New Announcement' : 'New Event'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-cyan-200 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'announcements' ? (
              <form onSubmit={handleAnnSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter announcement title"
                    value={newAnn.title}
                    onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newAnn.category}
                    onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value as any })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Advisory">Advisory</option>
                    <option value="Health">Health Mission</option>
                    <option value="Safety">Safety & Disaster</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Purok</label>
                  <input
                    type="text"
                    placeholder="All, Purok 1, Purok 2, etc."
                    value={newAnn.target_purok}
                    onChange={(e) => setNewAnn({ ...newAnn, target_purok: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write the announcement details..."
                    value={newAnn.content}
                    onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none text-gray-700"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-gray-700">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold transition-colors">Post Announcement</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEvtSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter event name"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                      value={newEvent.event_time}
                      onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter venue"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Organizer</label>
                  <input
                    type="text"
                    placeholder="Barangay SF II Council"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the event..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none text-gray-700"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-gray-700">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold transition-colors">Post Event</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};