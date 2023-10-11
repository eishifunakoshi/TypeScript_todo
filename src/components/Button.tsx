type ButtonProps = {
  title: string;
  propsOnClick: () => void;
  disabled?: boolean;
};

export const Button = ({ title, propsOnClick, disabled }: ButtonProps) => {
  // const { title  = props.title

  return (
    <button onClick={propsOnClick} disabled={disabled}>
      {title}
    </button>
  );
};
