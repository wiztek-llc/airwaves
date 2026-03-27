export interface Station {
  id: string;
  name: string;
  description: string;
  genre: string;
  color: string;
  artwork: string;
}

export const stations: Station[] = [
  {
    id: "lofi-chill",
    name: "24/7 Lo-Fi Chill",
    description: "Jazz-infused beats from a golden era that never existed",
    genre: "Lo-Fi",
    color: "#8B9DC3",
    artwork: "/stations/lofi-chill.png",
  },
];
