import { ServerToClientRoomEvents, ClientToServerRoomEvents } from './roomEvents';
import { ServerToClientUnoEvents, ClientToServerUnoEvents } from './unoEvents';

export type ServerToClientEvents = ServerToClientRoomEvents & ServerToClientUnoEvents;
export type ClientToServerEvents = ClientToServerRoomEvents & ClientToServerUnoEvents;