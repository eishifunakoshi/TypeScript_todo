type InputProps = {
  type: string;
  propsOnchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  disabled?: boolean;
  checked?: boolean;
};

export const Input = ({
  type,
  propsOnchange,
  value,
  disabled,
  checked,
}: InputProps) => {
  return (
    <input
      type={type}
      onChange={propsOnchange}
      value={value}
      disabled={disabled}
      checked={checked}
    ></input>
  );
};
