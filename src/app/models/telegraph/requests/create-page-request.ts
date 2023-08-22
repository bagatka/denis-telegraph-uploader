import { Node } from '../types';

export interface CreatePageRequest {
    title: string;
    content: Array<Node>;
    access_token: string;
    author_name?: string;
    author_url?: string;
    return_content?: boolean;
}
