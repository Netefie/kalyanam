"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Accommodation",
    href: "/admin/accommodation",
    icon: BedDouble,
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    title: "Enquiries",
    href: "/admin/enquiries",
    icon: MessageSquare,
  },
 
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="sidebar">

        {/* Logo */}

        <div>

          <div className="logoSection">

            <div className="logoCircle">

              <Image
                src="/Whitelogo.png"
                alt="Kalyanam"
                width={822}
                height={822}
              />

            </div>

            

          </div>

          {/* Divider */}

          <div className="divider" />



          {/* Navigation */}

          <nav>

            {menuItems.map((item) => {

              const Icon = item.icon;

             const active =
  pathname.startsWith(item.href);

              return (

               <Link
  key={item.href}
  href={item.href}
  className={`menuItem ${
    pathname === item.href ? "active" : ""
  }`}
>

                  <div className="left">

                    <Icon size={20} />

                    <span>
                      {item.title}
                    </span>

                  </div>

                  

                </Link>

              );

            })}

          </nav>

        </div>

        {/* Bottom */}

        <div>

          
          <Link
            href="/admin/login"
            className="logout"
          >

            <LogOut size={20} />

            Logout

          </Link>

        </div>

      </aside>

      <style>{`
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background: #956124;
    border-right: 1px solid rgba(255,255,255,.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 22px;
    overflow-y: auto;
    z-index: 999;
  }

  .sidebar::-webkit-scrollbar {
    width: 5px;
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: #b68d40;
    border-radius: 20px;
  }

  /* ---------------- Logo ---------------- */

  .logoSection {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .logoCircle {
    width: 104px;
    height: 104px;
    border-radius: 0px;
   
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logoSection h2 {
    margin: 0;
    color: #fff;
    font-size: 30px;
    font-family: var(--font-cormorant);
    font-weight: 700;
    letter-spacing: 2px;
  }
  /* ---------------- Menu ---------------- */

  nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 28px;
  }
.menuItem{
  display:flex;
  align-items:center;
  justify-content:space-between;
  text-decoration:none;
  height:68px;
  padding:0 28px;
  border-radius:8px;
  transition:all .35s ease;
  cursor:pointer;
}


  .left {
    display: flex;
    align-items: center;
    gap: 26px;
  }

  .left span {
    font-size: 18px;
    font-weight: 400;
    font-family:"Lato",sans-serif;
    color: #fff;
  transition: .35s;
  }
 
.menuItem svg{
  color:#fff;
  transition:.35s;
}



/* Hover */

.menuItem:hover{
  background:#B68D40;
  transform:translateX(6px);
}

.menuItem:hover svg,
.menuItem:hover .left span{
  color:#fff;
}

/* Active */

.menuItem.active{
  background:#B68D40;
}

.menuItem.active svg,
.menuItem.active .left span{
  color:#fff;
}

/* Active */

.menuItem.active {
  background: linear-gradient(
    90deg,
    #CDA55A,
    #B68D40
  );
  color: #fff;
  box-shadow: 0 12px 28px rgba(182,141,64,.28);
}

.menuItem.active svg,
.menuItem.active .left span,
.menuItem.active .arrow {
  color: #fff;
}

.arrow {
  opacity: 0;
  transform: translateX(-6px);
  transition: .35s;
}

  /* ---------------- Logout ---------------- */

  .logout {
    height: 56px;
    border-radius: 16px;
    background: #2b2b2b;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: white;
    text-decoration: none;
    transition: .35s;
    font-weight: 600;
  }

  .logout:hover {
    background: #c0392b;
    transform: translateY(-2px);
  }

  /* ---------------- Responsive ---------------- */

  @media (max-width: 992px) {

    .sidebar {
      width: 92px;
      padding: 24px 10px;
    }

    .logoSection {
      justify-content: center;
    }

    .logoSection h2,
    .logoSection span,
    .left span,
    .adminCard,
    .sectionTitle,
    .arrow {
      display: none;
    }

    .menuItem {
      justify-content: center;
      padding: 0;
    }

    .logout {
      font-size: 0;
    }

    .logout svg {
      margin: 0;
    }

  }
`}</style>

    </>
  );
}