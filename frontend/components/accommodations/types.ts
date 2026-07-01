export interface RoomType {
  id: string;
  name: string;
}

export interface BookingSearchState {
  roomType: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  rooms: number;
}