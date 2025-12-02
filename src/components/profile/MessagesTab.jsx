// src/components/profile/MessagesTab.jsx (Firebase Integrated)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ICONS } from '../icons.jsx';
// 💡 NEW: Import universal API functions
import { fetchCollectionData, updateListingStatus } from '../../utils/api.js'; 
// REMOVED: import { messageAPI, listingAPI } from '../../utils/api-endpoints.js';

const MessagesTab = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [user.id]);

  const loadMessages = async () => {
    const userId = user.id || user.uid;
    if (!userId) {
        setLoading(false);
        return;
    }
    
    try {
      setLoading(true);
      // 💡 NEW: Fetch messages from the 'contactSubmissions' collection.
      const data = await fetchCollectionData('contactSubmissions', [
          ['ownerId', '==', userId] // Assuming you save the ownerId of the listing/profile
      ]);
      
      // Sort: unread first, then by creation date
      const sortedMessages = data.sort((a, b) => {
          if (a.read === false && b.read === true) return -1;
          if (a.read === true && b.read === false) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      // 💡 REUSED: updateListingStatus to update the message's status to 'read'
      // NOTE: This assumes updateListingStatus can be used for any collection (like contactSubmissions)
      await updateListingStatus(messageId, { read: true }, 'contactSubmissions'); 
      loadMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-navy mb-2">Messages</h2>
        <p className="text-slate">Inquiries about your listings</p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <ICONS.MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-navy mb-2">No messages yet</h3>
          <p className="text-slate">You'll see inquiries about your listings here</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) {
                    handleMarkAsRead(message.id);
                  }
                }}
                className={`rounded-2xl border p-4 cursor-pointer transition ${
                  selectedMessage?.id === message.id
                    ? 'border-navy bg-navy/5'
                    : message.read
                      ? 'border-gray-200 bg-white'
                      : 'border-navy/30 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-navy">{message.subject || `Inquiry for Listing ${message.listingId?.slice(0, 8) || ''}`}</p>
                  {!message.read && (
                    <span className="h-2 w-2 rounded-full bg-navy"></span>
                  )}
                </div>
                <p className="text-sm text-slate line-clamp-2">{message.message}</p>
                <p className="text-xs text-slate mt-2">
                  {new Date(message.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
          {selectedMessage && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy">{selectedMessage.subject || 'Inquiry'}</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate hover:text-navy"
                >
                  <ICONS.X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate mb-1">From</p>
                  <p className="text-sm font-medium text-navy">
                    {selectedMessage.fromUserEmail || selectedMessage.email || 'Anonymous'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate mb-1">Message</p>
                  <p className="text-sm text-navy whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div>
                  <p className="text-xs text-slate mb-1">Date</p>
                  <p className="text-sm text-navy">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedMessage.listingId && (
                  <button
                    onClick={() => window.location.href = `/property/${selectedMessage.listingId}`}
                    className="w-full rounded-full border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy/5"
                  >
                    View Listing
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesTab;