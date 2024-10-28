export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}


export type WorkspaceType = {
    id: string,
    name: string,
    image: string | null,
    inviteCode: string,
    userId: string
};