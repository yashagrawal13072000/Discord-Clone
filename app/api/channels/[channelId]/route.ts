// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { MemberRole } from "@prisma/client";
// import { NextResponse } from "next/server";


// export async function DELETE(
//     req: Request,
//     { params }: { params: { channelId: string }}
//     ) {
//         try {
//             const profile = await currentProfile();
//             const { searchParams } = new URL(req.url);

//             const serverId = searchParams.get("serverId");

//             if(!profile) {
//                 return new NextResponse("Unauthorized", {status: 401});
//             }

//             if(!serverId) {
//                 return new NextResponse("Server ID Missing", {status:400});
//             }

//             if (!params.channelId) {
//                 return new NextResponse("Channel ID Missing", {status:400});
//             }

//             const server = await db.server.update({
//                 where: {
//                     id: serverId,
//                     members: {
//                         some: {
//                             profileId: profile.id,
//                             role: {
//                                 in: [MemberRole.ADMIN, MemberRole.MODERATOR],
//                             }
//                         }
//                     }
//                 },
//                 data: {
//                     channels: {
//                         delete: {
//                             id: params.channelId,
//                             name: {
//                                 not: "general",
//                             }
//                         }
//                     }
//                 }
//             });

//             return NextResponse.json(server);

//         } catch (error) {
//             console.log("[CHANNEL_ID_DELETE]", error);
//             return new NextResponse("Internal Error", {status:500});
//         }
    
// }

// export async function PATCH(
//     req: Request,
//     { params }: { params: { channelId: string }}
//     ) {
//         try {
//             const profile = await currentProfile();
//             const {name,type} = await req.json();
//             const { searchParams } = new URL(req.url);

//             const serverId = searchParams.get("serverId");

//             if(!profile) {
//                 return new NextResponse("Unauthorized", {status: 401});
//             }

//             if(!serverId) {
//                 return new NextResponse("Server ID Missing", {status:400});
//             }

//             if (!params.channelId) {
//                 return new NextResponse("Channel ID Missing", {status:400});
//             }

//             if (name === "general") {
//                 return new NextResponse("Name cannot be 'general'", {status:400})
//             }

//             const server = await db.server.update({
//                 where: {
//                     id: serverId,
//                     members: {
//                         some: {
//                             profileId: profile.id,
//                             role: {
//                                 in: [MemberRole.ADMIN, MemberRole.MODERATOR],
//                             }
//                         }
//                     }
//                 },
//                 data: {
//                     channels: {
//                         update: {
//                             where: {
//                                 id: params.channelId,
//                                 NOT: {
//                                     name: "general",
//                             },
//                         },
//                         data: {
//                             name,
//                             type,
//                         }
//                     }
//                     }
//                 }
//             });

//             return NextResponse.json(server);

//         } catch (error) {
//             console.log("[CHANNEL_ID_PATCH]", error);
//             return new NextResponse("Internal Error", {status:500});
//         }
    
// }

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// Helper function to check if the user has the required role
async function userHasRole(profileId: string, serverId: string, roles: MemberRole[]) {
    const membership = await db.server.findFirst({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId,
                    role: {
                        in: roles,
                    },
                },
            },
        },
        select: { id: true },
    });
    return !!membership;
}

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID Missing", { status: 400 });
        }

        const hasRole = await userHasRole(profile.id, serverId, [MemberRole.ADMIN, MemberRole.MODERATOR]);
        if (!hasRole) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const server = await db.server.update({
            where: { id: serverId },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.error("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID Missing", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }

        const hasRole = await userHasRole(profile.id, serverId, [MemberRole.ADMIN, MemberRole.MODERATOR]);
        if (!hasRole) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const server = await db.server.update({
            where: { id: serverId },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general",
                            },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.error("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
