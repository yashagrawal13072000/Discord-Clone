// // import { currentUser, redirectToSignIn} from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";
// import { RedirectToSignIn } from "@clerk/nextjs";
// import { db } from "@/lib/db"

// export const initialProfile = async () => {
//     const user = await currentUser();

//     if (!user) {
//         return RedirectToSignIn();
//     }

//     const profile = await db.profile.findUnique({
//         where: {
//             userId: user.id
//         }
//     });

//     if (profile) {
//         return profile;
//     }

//     const newProfile = await db.profile.create({
//         data: {
//             userId: user.id,
//             name: `${user.firstName} ${user.lastName}`,
//             imageUrl: user.imageUrl,
//             email: user.emailAddresses[0].emailAddress
//         }
//     });

//     return newProfile
// };

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    // Use Next.js's built-in redirect function for server-side redirects
    redirect("/sign-in");
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};

