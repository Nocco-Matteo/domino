export interface Messaggio {
    text: string,
    image?: string,
    sender: 'user' | 'character'
}