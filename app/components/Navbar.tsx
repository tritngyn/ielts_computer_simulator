import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <div className="space-x-4">
        <Link href="/"> Home </Link>
        <Link href="/reading"> Reading </Link>
        <Link href="/listening"> Listening </Link>
        <Link href="/writing"> Writing </Link>
        <Link href="/speaking"> Speaking </Link>
        <Link href="/profile"> Profile </Link>
      </div>
    </nav>
  );
};
export default Navbar;
