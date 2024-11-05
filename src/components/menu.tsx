"use client"
import { Clipboard, Grid2X2, Pencil, Settings, SquareChartGantt, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
export default function Menu() {
    interface Menu {
        name: string;
        icon: any;
        value: string
    }
    const menu: Menu[] = [{ name: "Хяналтын самбар", icon: Grid2X2, value: "" },
    { name: "Захиалга", icon: Clipboard, value: "order" },
    { name: "Орлого", icon: Tag, value: "income" },
    { name: "Бүтээгдэхүүн", icon: SquareChartGantt, value: "products" },
    { name: "Тохиргоо", icon: Settings, value: "settings" }
    ]

    const pathname = usePathname()

    return (
        <div className="w-[240px] h-screen font-bold text-base flex flex-col gap-4 bg-[#FFFFFF] mt-4">
            {menu.map(m =>
                <Link
                    key={m.name}
                    href={`/${m.value}`}
                    className={`py-2 px-4 flex gap-2 ${pathname ===`/${m.value}` ? "bg-slate-200" : ""}`}
                >
                    <m.icon />
                    {m.name}
                </Link>
            )}
        </div>
    )
}