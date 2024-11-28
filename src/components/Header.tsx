import drugLogo from "../assets/drugLogo.svg";
const Header = () => {
  return (
    <header className="z-10 flex items-center gap-2 border-b px-4 py-3 shadow">
      <img src={drugLogo} className="size-10" />
      <h1 className="text-xl font-bold md:text-2xl">MediRembours</h1>
    </header>
  );
};
export default Header;
