// "use client";

// import axios from "axios";
// import * as z from "zod";
// import {zodResolver} from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog"

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from "@/components/ui/form";

// import{ Input } from "@/components/ui/input"
// import{ Button } from "@/components/ui/button";
// import { FileUpload } from "../file-upload";
// import { useRouter } from "next/navigation";
// import { useModal } from "@/hooks/use-modal-store";

// const formSchema = z.object({
//     name: z.string().min(1, {
//         message: "Server name is required."
//     }),
//     imageUrl: z.string().min(1, {
//         message: "Server image is required."
// })
// });

// export const CreateServerModal = () => {
//     const { isOpen, onClose, type } = useModal();
//     const router = useRouter();

//     const isModalOpen = isOpen && type === "createServer";

//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             name: "",
//             imageUrl: "",
//         }
//     });

//     const isLoading = form.formState.isSubmitting;

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         try{
//             await axios.post("/api/servers", values);

//             form.reset();
//             router.refresh();
//             onClose();
//         } catch (error) {
//             console.log(error);
//         }

//     }

//     const handleClose = () => {
//         form.reset();
//         onClose();
//     }

//     return (
//         <Dialog open={isModalOpen} onOpenChange={handleClose}>
//             <DialogContent className="bg-white text-black p-0 overflow-hidden">
//                 <DialogHeader className="pt-8 px-6">
//                     <DialogTitle className="text-2xl text-center font-bold">
//                         Customize your server
//                     </DialogTitle>
//                     <DialogDescription className="text-center text-zinc-500">
//                         Give your server a personality with a name and an image. Change later
//                     </DialogDescription>
//                 </DialogHeader>
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} 
//                     className="space-y-8">
//                         <div className="space-y-8 px-6">
//                             <div className="flex items-center justify-center text-center">
//                                 <FormField 
//                                 control={form.control}
//                                 name="imageUrl"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormControl>
//                                             <FileUpload
//                                             endpoint="serverImage"
//                                             value = {field.value}
//                                             onChange={field.onChange}
//                                             />
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                                 />
//                             </div>

//                             <FormField 
//                             control={form.control}
//                             name = "name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel
//                                     className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
//                                         Server name
//                                     </FormLabel>
//                                     <FormControl>
//                                         <Input
//                                         disabled={isLoading}
//                                         className="bg-zinc-300/50 border-0
//                                         focus-visible:ring-0 text-black
//                                         focus-visible:ring-offset-0"
//                                         placeholder="Enter Server name"
//                                         {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                             />
//                         </div>
//                         <DialogFooter className="bg-gray-100 px-6 py-4">
//                             <Button variant={"primary"} disabled = {isLoading}>
//                                 Create
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     )
// }

"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try{
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite", { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
               <div className="p-6">
                <Label 
                className="uppercase text-xs font-bold text-zinc-500 
                dark:text-secondary/70">
                    Server Invite Link
                </Label>
                <div className="flex items-center mt-2 gap-x-2">
                    <Input
                    disabled={isLoading}
                    className="bg-zinc-300/50 border-0 
                    focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    value={inviteUrl} />
                    <Button disabled={isLoading} onClick={onCopy} size="icon">
                        {copied 
                        ? <Check className="w-4 h-4" /> 
                        : <Copy className="w-4 h-4" /> 
                        }
                    </Button>
                </div>
                <Button
                onClick={onNew}
                disabled={isLoading}
                variant="link"
                size="sm"
                className="text-xs text-zinc-500 mt-4">
                        Generate a new Link
                        <RefreshCw className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
