export type UserId = string;

export interface User {
    id: UserId;
    name: string;
    username: string;
    public: boolean;
    playlists: string[]; // Array of playlist IDs
    createdAt: string;
}