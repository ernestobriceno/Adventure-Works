import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type NavbarProps = {
  onOpenCart?: () => void;
};

export default function Navbar({ onOpenCart }: NavbarProps) {
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const link =
    "px-3 py-2 rounded-lg hover:bg-neutral-100 transition text-sm text-neutral-700";
  const isActive = ({ isActive }: { isActive: boolean }) =>
    `${link} ${isActive ? "font-semibold text-black" : ""}`;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <nav className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-black text-2xl tracking-tight">
          AdventureWorksCycle
        </Link>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <ul className="hidden md:flex items-center gap-1">
          <li>
            <NavLink to="/" className={isActive}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/deals" className={isActive}>
              Deals
            </NavLink>
          </li>
          <li>
            <NavLink to="/new-arrivals" className={isActive}>
              New Arrivals
            </NavLink>
          </li>
          <li>
            <NavLink to="/packages" className={isActive}>
              Packages
            </NavLink>
          </li>

          {user ? (
            <>
              <li className="text-sm text-neutral-500 px-2">
                Hi, {user.email?.split("@")[0]}
              </li>
              <li>
                <button onClick={signOut} className={link}>
                  Sign out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/signin" className={isActive}>
                  Sign in
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-black text-white text-sm shadow"
                >
                  Sign Up
                </NavLink>
              </li>
            </>
          )}

          <li>
            <button
              onClick={onOpenCart}
              className="ml-2 relative px-3 py-2 rounded-lg border"
            >
              🛒
              <span className="absolute -right-2 -top-1 text-xs bg-black text-white rounded-full px-1">
                {count}
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-white">
          <ul className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            <li>
              <NavLink to="/" className={isActive} onClick={() => setOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/deals"
                className={isActive}
                onClick={() => setOpen(false)}
              >
                Deals
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/new-arrivals"
                className={isActive}
                onClick={() => setOpen(false)}
              >
                New Arrivals
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/packages"
                className={isActive}
                onClick={() => setOpen(false)}
              >
                Packages
              </NavLink>
            </li>

            {user ? (
              <>
                <li className="px-3 py-2 text-sm text-neutral-500">
                  Hi, {user.email?.split("@")[0]}
                </li>
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className={link}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/signin"
                    className={isActive}
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 rounded-lg bg-black text-white text-sm shadow inline-block"
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}

            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  onOpenCart && onOpenCart();
                }}
                className="mt-1 px-4 py-2 rounded-lg border inline-flex items-center gap-2"
              >
                🛒 <span className="text-sm">Cart</span>
                <span className="ml-auto text-xs bg-black text-white rounded-full px-1">
                  {count}
                </span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
