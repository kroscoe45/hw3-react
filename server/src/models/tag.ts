import { UserId } from "./user";

export type TagId = string;

export interface Tag {
    id: TagId;
    name: string;
    upvotes : UserId[];
    downvotes : UserId[];
}