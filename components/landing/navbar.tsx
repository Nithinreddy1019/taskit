import Image from "next/image";

import logoSource from "@/public/logo.svg";
import { ButtonLanding } from "./button-landing";
import Link from "next/link";

const navLinks = [
    { label: "Home", href:"#" },
    { label: "Features", href:"#features" },
    { label: "FAQs", href:"#faqs" },
];



export const Navbar = () => {
    return (
        <section className="py-4 lg:py-8">
            <div className="container max-w-5xl">
                <div className="grid grid-cols-2 lg:grid-cols-3 border border-white/15 rounded-xl py-2 px-4 md:pr-2 items-center">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <Image 
                                src={logoSource}
                                alt="logo"
                                className="h-9 w-auto"
                            />
                            <h3 className="text-2xl font-bold">Taskit</h3>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-center">
                        <nav className="flex gap-6 font-md">
                            {navLinks.map((link) => (
                                <a href={link.href} key={link.label}>
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="flex justify-end gap-4">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-menu md:hidden"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>

                        <ButtonLanding variant="secondary" className="hidden md:inline-flex items-center">
                            <Link href={"/sign-in"} className="w-full h-full flex items-center">
                                Log in
                            </Link>
                        </ButtonLanding>
                        <ButtonLanding variant="primary" className="hidden md:inline-flex items-center">
                            <Link href={"sign-up"} className="w-full h-full flex items-center">
                                Sign up
                            </Link>
                        </ButtonLanding>
                    </div>
                </div>
            </div>
        </section>
    )
}