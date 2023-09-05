import { FC, InputHTMLAttributes, useId } from "react";
import { IconType } from "react-icons/lib";
import clsx from "clsx"

export interface InputWithIconProps
  extends InputHTMLAttributes<HTMLInputElement> {
    Icon : IconType;
    hide ?: boolean;
    iconClassName?: string;
    containerClassName?: string;
}

const InputWithIcon : FC<InputWithIconProps> = ({Icon , hide = false , className, ...props}) => {

    const id = useId();

    return (
        <div hidden={hide}
        className={clsx(
            'relative',
            props.containerClassName
        )}
        >
            <input
                className={clsx(
                    'w-full input input-bordered pl-12 transition-colors duration-200 ease-linear focus:border-primary focus:outline-none',
                    className
                )}
                id={id}
                {...props}
            />
            <label htmlFor={id}>
                <Icon
                size={20}
                className={clsx(
                    'absolute top-1/2 left-4 -translate-y-1/2',
                    props.iconClassName
                )}
                />
            </label>
        </div>
    )
}

export default InputWithIcon;