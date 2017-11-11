import _LocalStorage from './LocalStorage';
import _SyncStorage from './SyncStorage';
import _Notifications from './Notifications';

// export default {
//   LocalStorage: new _LocalStorage,
//   SyncStorage: new _SyncStorage,
//   Notifications: new _Notifications
// }

export const LocalStorage = new _LocalStorage;
export const SyncStorage = new _SyncStorage;
export const Notifications = _Notifications;