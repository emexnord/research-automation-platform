// import { CreateSharedLinkDto } from '@/types/shared-links';

// export class SharedLinksService {
//     constructor() {
//         console.log("Environment variable NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
//     }
//     private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/shared-links`;
//     async createSharedLink(data: CreateSharedLinkDto) {
//         console.log("the base url is ", this.baseUrl);
//         const response = await fetch(this.baseUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify(data),
//         });

//         console.log("the response is ", response);
//         if (!response.ok) {
//             throw new Error('Failed to create shared link');
//         }

//         return response.json();
//     }

//     async revokeSharedLink(linkId: string) {
//         const response = await fetch(`${this.baseUrl}/${linkId}`, {
//             method: 'DELETE',
//         });

//         if (!response.ok) {
//             throw new Error('Failed to revoke shared link');
//         }

//         return response.json();
//     }

//     async accessSharedLink(linkId: string, password?: string) {
//         const response = await fetch(`${this.baseUrl}/${linkId}/access`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ password }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to access shared link');
//         }

//         return response.json();
//     }
// }

// export const sharedLinksService = new SharedLinksService();
