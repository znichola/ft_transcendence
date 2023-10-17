interface IInputField {
  value: string;
  lable: string;
  placeholder: string;
  mustHave?: boolean;
  max?: number;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Heading({ title }: { title: string }) {
  return (
    <h1 className=" gradient-hightlight text-center text-5xl py-2 font-bold ">
      {title}
    </h1>
  );
}

export function PreHeading({ text }: { text: string }) {
  return <p className="text-left font-semibold">{text}</p>;
}

export function InputField({
  lable,
  max,
  mustHave,
  placeholder,
  value,
  onChange,
  disabled,
}: IInputField) {
  return (
    <div>
      <label
        className={disabled ? "text-slate-300" : "text-slate-400"}
        htmlFor="channel-name-input"
      >
        {mustHave ? (
          <em className="select-none font-semibold text-rose-600">* </em>
        ) : (
          <em className="select-none font-semibold text-transparent">* </em>
        )}
        {lable}
      </label>
      <div
        className={`relative rounded-xl border p-2 focus-within:border-rose-500 ${
          disabled ? "border-slate-200" : "border-slate-300"
        } `}
      >
        <input
          id="channel-name-input"
          className="w-full bg-transparent outline-none placeholder:text-slate-300 focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200"
          type="text"
          autoComplete="off"
          max={max}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          disabled={disabled}
        />
        {max ? (
          <i className="absolute right-1 select-none px-2 font-light text-slate-200 group-focus-within:text-rose-400">
            {value.length + " / " + max}
          </i>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

interface IInputFile {
  lable: string;
  name: string;
  mustHave?: boolean;
  disabled?: boolean;
  accept?: string;
}

export function InputFile({
  lable,
  name,
  mustHave,
  disabled,
  accept,
}: IInputFile) {
  return (
    <div>
      <label
        className={disabled ? "text-slate-300" : "text-slate-400"}
        htmlFor="file-input"
      >
        {mustHave ? (
          <em className="select-none font-semibold text-rose-600">* </em>
        ) : (
          <em className="select-none font-semibold text-transparent">* </em>
        )}
        {lable}
      </label>
      <div
        className={`relative rounded-xl border p-2 focus-within:border-rose-500 ${
          disabled ? "border-slate-200" : "border-slate-300"
        } `}
      >
        <input
          className="w-full text-slate-300 outline-none file:border-0 file:border-r-2 file:border-solid file:border-slate-300 file:bg-transparent file:text-slate-400 file:hover:border-rose-400 file:hover:text-rose-400 focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200"
          id={name}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

interface IInputToggle {
  onLable: string;
  offLable: string;
  value: boolean;
  onToggle: () => void;
}

export function InputToggle({
  onLable,
  offLable,
  value,
  onToggle,
}: IInputToggle) {
  const tag = (
    onLable.replace(" ", "-") +
    "-" +
    offLable.replace(" ", "-")
  ).toLocaleLowerCase();

  console.log(onLable, value);

  return (
    <div className="relative flex w-32 flex-wrap items-center">
      <input
        className="peer relative h-10 w-5 cursor-pointer appearance-none rounded-full bg-stone-200 transition-colors after:absolute after:left-0 after:top-0 after:h-5 after:w-5 after:rounded-full after:bg-stone-400 after:transition-all checked:bg-rose-200 checked:after:top-5 checked:after:bg-rose-500 hover:bg-stone-300 after:hover:bg-stone-400 checked:hover:bg-rose-300 checked:after:hover:bg-rose-500 focus:outline-none focus-visible:outline-none"
        type="checkbox"
        checked={value}
        onChange={onToggle}
        id={tag}
      />
      <label
        className="cursor-pointer select-none pl-2 font-semibold peer-disabled:cursor-not-allowed peer-disabled:text-slate-300"
        htmlFor={tag}
      >
        {value ? onLable : offLable}
      </label>
    </div>
  );
}

export function SubmitBTN({ lable }: { lable?: string }) {
  return (
    <button
      type="submit"
      className="flex h-10 w-min items-center justify-center rounded-xl border-b-2 border-stone-300 bg-stone-200 px-5 py-2 font-semibold text-slate-500 transition-all duration-100 hover:border-b-4 hover:border-rose-400 hover:text-rose-500 focus:outline focus:outline-rose-400"
    >
      {lable || "Submit"}
    </button>
  );
}
