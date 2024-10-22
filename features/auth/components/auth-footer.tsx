import Link from "next/link"

interface AuthFooterProps {
    footerText: string,
    footerLink: string,
    linkText: string
}

export const AuthFooter = ({
    footerText,
    footerLink,
    linkText
}: AuthFooterProps) => {
    return (
        <div className="flex items-center w-full justify-center text-sm gap-1">
            <p>{footerText}</p>
            <Link href={footerLink} className="text-blue-500">
                {linkText}
            </Link>
        </div>
    )
}