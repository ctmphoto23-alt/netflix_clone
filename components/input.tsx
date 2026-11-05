import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type InputProps = {
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  label: string;
  type: HTMLInputTypeAttribute;
};

const Input = ({ id, onChange, value, label, type }: InputProps) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer block w-full appearance-none rounded-md bg-neutral-700 px-6 pb-1 pt-6 text-md text-white focus:outline-none focus:ring-0"
    />
    <label
      htmlFor={id}
      className="absolute left-6 top-3 z-10 origin-[0] -translate-y-3 transform text-md text-zinc-400 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75"
    >
      {label}
    </label>
  </div>
);

export default Input;
