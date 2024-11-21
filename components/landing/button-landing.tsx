import { cva } from "class-variance-authority";
import { HTMLAttributes } from "react";


const classes = cva('border h-12 rounded-lg px-6 font-medium', {
    variants: {
        variant: {
            primary: "bg-blue-500 text-neutral-950 border-blue-600",
            secondary: "border-white/80 text-white bg-transparent"
        }
    }
});



export const ButtonLanding = (props: { variant: "primary" | "secondary"} & HTMLAttributes<HTMLButtonElement>) => {
    
    const { variant, className, ...otherProps} = props;
    
    return (
        <button 
            className={classes({
                variant: variant, className: className
            })}
            {...otherProps}
        />
    )
}