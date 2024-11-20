import Link from "next/link"

interface AuthFooterProps {
    footerText: string,
    footerLink: string,
    linkText: string
    showPasswordReset?: boolean
}

export const AuthFooter = ({
    footerText,
    footerLink,
    linkText,
    showPasswordReset
}: AuthFooterProps) => {
    return (
        <div className="px-1 space-y-2">
            {showPasswordReset && (
                <p className="text-sm text-muted-foreground">Forgot password?</p>
            )}
            <div className="flex items-center w-full text-sm gap-1">
                <p className="text-muted-foreground">{footerText}</p>
                <Link href={footerLink} className="text-blue-500">
                    {linkText}
                </Link>
            </div>
        </div>
    )
}