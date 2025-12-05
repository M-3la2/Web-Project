import { RegistrationHandler } from './registration.js';
import { CheckinHandler } from './checkin.js';
import { HistoryHandler } from './history.js';
import { CalendarHandler } from './calendar.js';
import { ContactHandler } from './contact.js';

// Initialize modules on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    RegistrationHandler.init();
    CheckinHandler.init();
    HistoryHandler.init();
    CalendarHandler.init();
    ContactHandler.init();
});
