"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale/toggle";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import SignToggle from "@/components/sign/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { cn } from "@/lib/utils";

export default function Header({ header }: { header: HeaderType }) {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (header.disabled) {
    return null;
  }

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className="fixed z-20 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-7xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 rounded-2xl border border-border/30 backdrop-blur-lg"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* 左侧：Logo + 导航菜单 */}
            <div className="flex w-full items-center justify-between lg:w-auto lg:justify-start lg:gap-6">
              <Link
                href={(header.brand?.url as any) || "/"}
                className="flex items-center gap-2"
                aria-label="home"
                onClick={() => setMenuState(false)}
              >
                {header.brand?.logo?.src ? (
                  <img
                    src={header.brand.logo.src}
                    alt={header.brand.logo.alt || header.brand.title}
                    className="w-8"
                  />
                ) : (
                  <span className="grid size-9 place-items-center rounded-full border border-[#bca5b3] bg-[#5d3c55] text-white shadow-sm">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                )}
                {header.brand?.title && (
                  <span className="font-serif text-xl font-semibold tracking-[-0.02em] text-foreground">
                    {header.brand?.title || ""}
                  </span>
                )}
              </Link>
              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
              {/* 桌面端导航菜单 - 靠左，紧跟在 Logo 后面 */}
              <div className="hidden lg:block">
                <ul className="flex items-center gap-1 text-sm">
                  {header.nav?.items?.map((item, i) => {
                    const hasChildren = Boolean(item.children?.length);

                    return (
                      <li key={`${item.title}-${i}`} className="group/nav relative">
                        {hasChildren ? (
                          <>
                            <button
                              type="button"
                              aria-haspopup="menu"
                              className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-foreground/80 transition-colors hover:bg-[#f4ecef] hover:text-foreground focus-visible:bg-[#f4ecef] focus-visible:text-foreground focus-visible:outline-none"
                            >
                              <span>{item.title}</span>
                              <ChevronDown
                                className="size-3.5 transition-transform duration-200 group-hover/nav:rotate-180 group-focus-within/nav:rotate-180"
                                aria-hidden="true"
                              />
                            </button>

                            <div className="invisible absolute left-1/2 top-full z-40 w-[34rem] -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                              <div
                                role="menu"
                                aria-label={item.title}
                                className="grid grid-cols-2 gap-1 rounded-2xl border border-annora-border bg-white/95 p-3 shadow-[0_22px_60px_rgba(66,44,59,0.16)] backdrop-blur-xl"
                              >
                                {item.children?.map((child, childIndex) => {
                                  const itemContent = (
                                    <>
                                      <span className="block font-semibold text-annora-heading">
                                        {child.title}
                                      </span>
                                      {child.description && (
                                        <span className="mt-1 block text-xs font-normal leading-5 text-annora-muted">
                                          {child.description}
                                        </span>
                                      )}
                                    </>
                                  );

                                  return child.url ? (
                                    <Link
                                      key={`${child.title}-${childIndex}`}
                                      href={child.url as any}
                                      target={child.target}
                                      role="menuitem"
                                      className="rounded-xl px-4 py-3 transition-colors hover:bg-[#f6eef2] focus-visible:bg-[#f6eef2] focus-visible:outline-none"
                                    >
                                      {itemContent}
                                    </Link>
                                  ) : (
                                    <div
                                      key={`${child.title}-${childIndex}`}
                                      role="menuitem"
                                      aria-disabled="true"
                                      tabIndex={0}
                                      className="cursor-default rounded-xl px-4 py-3 focus-visible:bg-[#f6eef2] focus-visible:outline-none"
                                    >
                                      {itemContent}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        ) : item.url ? (
                          <Link
                            href={item.url as any}
                            target={item.target}
                            className="block rounded-lg px-3 py-2 font-medium text-foreground/80 transition-colors hover:bg-[#f4ecef] hover:text-foreground"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <span className="block cursor-default rounded-lg px-3 py-2 font-medium text-foreground/70">
                            {item.title}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* 右侧控制按钮 - 桌面端 */}
            <div className="hidden w-full flex-wrap items-center justify-end gap-2 lg:flex lg:w-fit">
              {header.show_locale && <LocaleToggle />}
              {header.show_theme && <ThemeToggle />}
              {header.buttons?.map((item, i) => {
                return (
                  <Button key={i} variant={item.variant} size="sm">
                    <Link
                      href={item.url as any}
                      target={item.target || ""}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {item.title}
                      {item.icon && (
                        <Icon name={item.icon} className="size-3 shrink-0" />
                      )}
                    </Link>
                  </Button>
                );
              })}
              {header.show_sign && <SignToggle />}
            </div>
          </div>

          {/* 移动端展开菜单 - 下拉式 */}
          <div className="bg-background group-data-[state=active]:block mb-6 hidden w-full rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 dark:shadow-none">
            {/* 上半部分：导航菜单 */}
            <div className="w-full pb-4">
              <ul className="space-y-2">
                {header.nav?.items?.map((item, i) => {
                  const hasChildren = Boolean(item.children?.length);

                  return (
                    <li key={`${item.title}-${i}`}>
                      {hasChildren ? (
                        <details className="group/mobile-nav rounded-2xl border border-annora-border/70 bg-white/55 px-4">
                          <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-semibold text-foreground marker:content-none">
                            <span>{item.title}</span>
                            <ChevronDown
                              className="size-4 transition-transform group-open/mobile-nav:rotate-180"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="space-y-1 border-t border-annora-border/60 py-2">
                            {item.children?.map((child, childIndex) =>
                              child.url ? (
                                <Link
                                  key={`${child.title}-${childIndex}`}
                                  href={child.url as any}
                                  target={child.target}
                                  className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#f6eef2]"
                                  onClick={() => setMenuState(false)}
                                >
                                  <span className="block text-sm font-semibold text-annora-heading">
                                    {child.title}
                                  </span>
                                  {child.description && (
                                    <span className="mt-1 block text-xs leading-5 text-annora-muted">
                                      {child.description}
                                    </span>
                                  )}
                                </Link>
                              ) : (
                                <div
                                  key={`${child.title}-${childIndex}`}
                                  aria-disabled="true"
                                  className="cursor-default rounded-xl px-3 py-2.5"
                                >
                                  <span className="block text-sm font-semibold text-annora-heading">
                                    {child.title}
                                  </span>
                                  {child.description && (
                                    <span className="mt-1 block text-xs leading-5 text-annora-muted">
                                      {child.description}
                                    </span>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </details>
                      ) : item.url ? (
                        <Link
                          href={item.url as any}
                          target={item.target}
                          className="block py-2 text-base font-medium text-foreground/90 transition-colors hover:text-foreground"
                          onClick={() => setMenuState(false)}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="block py-2 text-base font-medium text-foreground/70">
                          {item.title}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 分隔线 */}
            {(header.show_locale || header.show_theme || header.show_sign || (header.buttons && header.buttons.length > 0)) && (
              <div className="border-t border-border/50 my-4"></div>
            )}

            {/* 下半部分：多语言、主题切换、按钮和登录 */}
            <div className="w-full pt-2 space-y-4">
              {/* 多语言和主题切换 - 水平排列 */}
              {(header.show_locale || header.show_theme) && (
                <div className="flex items-center justify-between gap-4 py-2">
                  {header.show_locale && (
                    <div className="flex-1">
                      <LocaleToggle />
                    </div>
                  )}
                  {header.show_theme && (
                    <div className="flex-1 flex justify-end">
                      <ThemeToggle />
                    </div>
                  )}
                </div>
              )}

              {/* 自定义按钮 */}
              {header.buttons && header.buttons.length > 0 && (
                <div className="flex flex-col gap-3">
                  {header.buttons.map((item, i) => {
                    return (
                      <Button
                        key={i}
                        variant={item.variant}
                        size="default"
                        className="w-full"
                        asChild
                      >
                        <Link
                          href={item.url as any}
                          target={item.target || ""}
                          className="flex items-center justify-center gap-2"
                          onClick={() => setMenuState(false)}
                        >
                          {item.icon && (
                            <Icon name={item.icon} className="size-4 shrink-0" />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* 登录/注册按钮 */}
              {header.show_sign && (
                <div className="pt-2 flex justify-start">
                  <SignToggle />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
