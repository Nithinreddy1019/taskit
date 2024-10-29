
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button, ButtonProps } from "@/components/ui/button";
import { 
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription
} from "@/components/ui/card";
import { useState } from "react";


export const useConfirm = (
    title: string,
    message: string,
    variant: ButtonProps["variant"] = "default"
): [() => JSX.Element, () => Promise<unknown>] => {

    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } |null>(null);

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        });
    };

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };


    const ConfirmationDialog = () => (
        <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-6">
                    <CardHeader className="p-0">
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <div className="w-full pt-4 flex flex-col gap-y-2 lg:flex-row lg:gap-x-2 items-center justify-end">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant={variant}
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            Confirm delete    
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    )


    return [ConfirmationDialog, confirm]

};