export const API_BASE = import.meta.env.VITE_API_BASEq || 'http://localhost:3000';

export const API_ENDPOINTS = {
  BROADCASTS: {
    GET_ALL: `${API_BASE}/getBroadcasts`,
    GET_CUSTOMERS: `${API_BASE}/getBroadcastCustomers`,
    DELETE: (id) => `${API_BASE}/broadcasts/${id}`,
  },
  CONTACTS: {
    ADD_SINGLE: `${API_BASE}/addcustomer`,
    ADD_MULTIPLE: `${API_BASE}/addcustomers`,
    GET_ALL: `${API_BASE}/contacts`,
    GET_CONVERSATION_ID: (customerId) => `${API_BASE}/conversationid?customer_id=${customerId}`,
  },
  CHAT: {
    CONVERSATIONS: `${API_BASE}/conversations`,
    MESSAGES: `${API_BASE}/messages`,
    SEND_MESSAGE: `${API_BASE}/sendmessage`,
  },
  TEMPLATES: {
    GET_ALL: `${API_BASE}/templates`,
  },
  GROUPS: {
    GET_ALL: `${API_BASE}/returnGroups`,
  },
  EXTERNAL: {
    COUNTRY_CODES: 'https://countriesnow.space/api/v0.1/countries/codes',
  }
};
