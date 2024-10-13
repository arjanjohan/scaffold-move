import { useCallback } from "react";
import { blo } from "blo";
import { CommonInputProps, InputBase } from "~~/components/scaffold-move";

/**
 * Address input with ENS name resolution
 */
export const AddressInput = ({ value, name, placeholder, onChange, disabled }: CommonInputProps<string>) => {

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange],
  );


  return (
    <InputBase<string>
      name={name}
      placeholder={placeholder}
      value={value as string}
      onChange={handleChange}
      disabled={disabled}
      
      suffix={
        // Don't want to use nextJS Image here (and adding remote patterns for the URL)
        // eslint-disable-next-line @next/next/no-img-element
        value && <img alt="" className="!rounded-full" src={blo(value as `0x${string}`)} width="35" height="35" />
      }
    />
  );
};
