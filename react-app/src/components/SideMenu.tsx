import {
  IconAtSymbol,
  IconBashShell,
  IconBolt,
  IconChatBubble,
  IconDownChevron,
  IconGroupChatBubble,
  IconHomeComputer,
  IconNewspaper,
  IconPeople,
} from "./Icons";

export default function SideMenu() {
  return (
    <div className="w-screen bg-gray-100">
      <div className="h-screen w-80 pb-10">
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
                <NavSimple name="Dashbord" icon={IconHomeComputer} />
                <NavSimple name="Messages" icon={IconChatBubble} />
                <div className="relative transition">
                  <input
                    className="peer hidden"
                    type="checkbox"
                    id="menu-1"
                    defaultChecked={false}
                  />
                  <button className="peer relative flex w-full items-center border-l-rose-600 px-4 py-3 text-sm font-medium text-gray-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:text-rose-600 focus:border-l-4">
                    <span className="mr-5 flex w-5">
                      <IconAtSymbol />
                    </span>
                    Analytics
                    <label
                      htmlFor="menu-1"
                      className="absolute inset-0 h-full w-full cursor-pointer"
                    />
                  </button>
                  <IconDownChevron className="absolute right-0 top-4 ml-auto mr-5 h-4 -rotate-90 text-gray-600 transition peer-checked:rotate-90 peer-hover:text-rose-600" />
                  <ul className="duration-400 m-2 flex max-h-0 flex-col overflow-hidden rounded-xl bg-gray-100 font-medium transition-all duration-300 peer-checked:max-h-96">
                    <NavSubmenu name="Some Page" icon={IconBolt} />
                    <NavSubmenu name="More Pages" icon={IconBashShell} />
                  </ul>
                </div>
              </nav>
              <Category name="Product Mangement" />
              <nav className="flex-1">
                <NavSimple name="Single Chat" icon={IconChatBubble} />
                <NavSimple name="Orders" icon={IconGroupChatBubble} />
                <NavSimple name="Suppliers" icon={IconPeople} />
              </nav>
              <Category name="Content Mangement" />
              <NavSimple name="Blog" icon={IconNewspaper} />
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
