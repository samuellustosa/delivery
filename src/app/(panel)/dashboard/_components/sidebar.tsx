"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
// Importação de ícones focados em Delivery
import { 
  Banknote, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Package, 
  List, 
  Settings, 
  MessageSquareText, 
  Users, 
  ShoppingBag 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../../../../public/logo-odonto.jpeg";

export function SidebarDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={clsx(
          "flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",
          {
            "w-20": isCollapsed,
            "w-64": !isCollapsed,
            "hidden md:flex md:fixed": true,
          }
        )}
      >
        <div className="mb-6 mt-6">
          {!isCollapsed && (
            <Image
              alt="Logo do Sistema"
              src={logoImg}
              priority
              quality={100}
            />
          )}
        </div>

        <Button 
          className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <ChevronLeft className="w-12 h-12"/> : <ChevronRight className="w-12 h-12"/>}
        </Button>

        <nav className="flex flex-col gap-1 overflow-hidden mt-2">
          {!isCollapsed && (
            <span className="text-xs text-gray-400 font-medium mt-1 uppercase px-3">
              Gestão de Vendas
            </span>
          )}
          
          <SidebarLink
            href="/dashboard"
            label="Pedidos"
            pathname={pathname}
            isCollapsed={isCollapsed}
            icon={<ShoppingBag className="w-6 h-6" />}
          />
          <SidebarLink
            href="/dashboard/categories"
            label="Categorias"
            pathname={pathname}
            isCollapsed={isCollapsed}
            icon={<LayoutGrid className="w-6 h-6" />}
          />
          <SidebarLink
            href="/dashboard/products"
            label="Produtos"
            pathname={pathname}
            isCollapsed={isCollapsed}
            icon={<Package className="w-6 h-6" />}
          />
          <SidebarLink
            href="/dashboard/clients"
            label="Clientes"
            pathname={pathname}
            isCollapsed={isCollapsed}
            icon={<Users className="w-6 h-6" />}
          />

          <Collapsible open={!isCollapsed}>
            <CollapsibleContent className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium mt-4 uppercase px-3">
                Configurações
              </span>

              <SidebarLink
                href="/dashboard/chatbot"
                label="Chatbot IA"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<MessageSquareText className="w-6 h-6" />}
              />
              <SidebarLink
                href="/dashboard/plans"
                label="Meu Plano"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className="w-6 h-6" />}
              />
              <SidebarLink
                href="/dashboard/profile"
                label="Config. Loja"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Settings className="w-6 h-6" />}
              />
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </aside>

      <div
        className={clsx("flex-1 flex-col transition-all duration-300", {
          "md:ml-20": isCollapsed,
          "md:ml-64": !isCollapsed,
        })}
      >
        {/* HEADER MOBILE */}
        <header className="md:hidden flex items-center justify-between border-b px-4 h-14 z-10 sticky top-0 bg-white">
          <Sheet>
            <div className="flex items-center gap-4">
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <h1 className="text-base font-semibold">Painel Delivery</h1>
            </div>

            <SheetContent side="left" className="sm:max-w-xs text-black p-4">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Gerencie seu negócio</SheetDescription>
              </SheetHeader>
              <nav className="grid gap-2 text-base pt-5">
                <SidebarLink href="/dashboard" label="Pedidos" pathname={pathname} isCollapsed={false} icon={<ShoppingBag />} />
                <SidebarLink href="/dashboard/categories" label="Categorias" pathname={pathname} isCollapsed={false} icon={<LayoutGrid />} />
                <SidebarLink href="/dashboard/products" label="Produtos" pathname={pathname} isCollapsed={false} icon={<Package />} />
                <SidebarLink href="/dashboard/clients" label="Clientes" pathname={pathname} isCollapsed={false} icon={<Users />} />
                <hr className="my-2" />
                <SidebarLink href="/dashboard/chatbot" label="Chatbot" pathname={pathname} isCollapsed={false} icon={<MessageSquareText />} />
                <SidebarLink href="/dashboard/profile" label="Configurações" pathname={pathname} isCollapsed={false} icon={<Settings />} />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 py-4 px-2 md:p-6">{children}</main>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
}

function SidebarLink({ href, icon, label, pathname, isCollapsed }: SidebarLinkProps) {
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={clsx(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-blue-50 text-gray-700"
        )}
      >
        <span className="w-6 h-6">{icon}</span>
        {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
      </div>
    </Link>
  );
}