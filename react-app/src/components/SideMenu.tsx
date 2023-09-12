export default function SideMenu() {
  return (
    <div className="w-screen bg-gray-100">
      <div className="h-screen w-64 pb-10">
        <div className="flex h-full flex-grow flex-col overflow-y-auto rounded-br-lg rounded-tr-lg bg-white pt-5 shadow-md">
          <div className="mt-10 flex items-center px-4">
            <img
              className="h-12 w-auto max-w-full align-middle"
              src="/images/R-Wx_NHvZBci3KLrgXhp1.png"
              alt="Sarah Collins"
            />
            <div className="ml-3 flex flex-col">
              <h3 className="font-medium">Sarah Carter</h3>
              <p className="text-xs text-gray-500">Sr. Engineer</p>
            </div>
          </div>
          <Category name="Analytics" />
          <div className="mt-3 flex flex-1 flex-col">
            <div className="">
              <nav className="flex-1">
                <NavSimple name="Dashbord" icon={HomeComputer} />
                <NavSimple name="Messages" icon={ChatBubble} />
                <div className="relative transition">
                  <input
                    className="peer hidden"
                    type="checkbox"
                    id="menu-1"
                    defaultChecked={false}
                  />
                  <button className="peer relative flex w-full items-center border-l-rose-600 px-4 py-3 text-sm font-medium text-gray-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:text-rose-600 focus:border-l-4">
                    <span className="mr-5 flex w-5">
                      <AtSymbol />
                    </span>
                    Analytics
                    <label
                      htmlFor="menu-1"
                      className="absolute inset-0 h-full w-full cursor-pointer"
                    />
                  </button>
                  <DownChevron className="absolute right-0 top-4 ml-auto mr-5 h-4 -rotate-90 text-gray-600 transition peer-checked:rotate-90 peer-hover:text-rose-600" />
                  <ul className="duration-400 m-2 flex max-h-0 flex-col overflow-hidden rounded-xl bg-gray-100 font-medium transition-all duration-300 peer-checked:max-h-96">
                    <NavSubmenu name="Some Page" icon={Bolt} />
                    <NavSubmenu name="More Pages" icon={BashShell} />
                  </ul>
                </div>
              </nav>
              <Category name="Product Mangement" />
              <nav className="flex-1">
                <NavSimple name="Single Chat" icon={ChatBubble} />
                <NavSimple name="Orders" icon={GroupChatBubble} />
                <NavSimple name="Suppliers" icon={People} />
              </nav>
              <Category name="Content Mangement" />
              <NavSimple name="Blog" icon={NewsPaper} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Category({ name }: { name: string }) {
  return (
    <span className="mb-2 ml-3 mt-10 block text-xs font-semibold text-gray-500">
      {name}
    </span>
  );
}

function NavSimple({
  name,
  icon: Icon,
}: {
  name: string;
  icon: () => JSX.Element;
}) {
  return (
    <nav className="flex-1">
      <a
        href="#"
        className="flex cursor-pointer items-center border-l-rose-600 px-4 py-2 text-sm font-medium text-gray-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4"
      >
        {Icon && <Icon />}
        <p className="ml-4">{name}</p>
      </a>
    </nav>
  );
}

function NavSubmenu({
  name,
  icon: Icon,
}: {
  name: string;
  icon: () => JSX.Element;
}) {
  return (
    <li className="m-2 flex cursor-pointer border-l-rose-600 py-3 pl-5 text-sm text-gray-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-rose-600">
      <span className="mr-5">{Icon && <Icon />}</span>
      {name}
    </li>
  );
}


// These are all SVG icons !

const NewsPaper = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
};

const People = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={2}
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
};

const GroupChatBubble = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      stroke-width={2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  );
};

const ChatBubble = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      stroke-width={2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
};

const HomeComputer = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      stroke-width={2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    </svg>
  );
};

const BashShell = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      stroke-width={2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
};

const Bolt = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      stroke-width={2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  );
};

const AtSymbol = () => {
  return (
    <svg
      className="h-5 w-5 align-middle"
      stroke-width={2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
      />
    </svg>
  );
};

const DownChevron = ({
  className = "h-5 w-5 align-middle",
}: {
  className: string;
}) => {
  return (
    <svg
      className={className}
      stroke-width={2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};


