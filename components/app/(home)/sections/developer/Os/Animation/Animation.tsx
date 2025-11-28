"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface GithubPullRequest {
  id: number;
  number: number;
  title: string;
  user: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  state: string;
  url: string;
}
import CurvyRect from "@/components/shared/layout/curvy-rect";
import { cn } from "@/lib/utils";

import BranchIcon from "./_svg/BranchIcon";
import setTimeoutOnVisible from "@/utils/set-timeout-on-visible";

export default function DeveloperOsAnimation({
  prs,
}: {
  prs: GithubPullRequest[];
}) {
  const [list, setList] = useState<GithubPullRequest[]>(
    prs.slice(prs.length - 4, prs.length),
  );
  const [avatars, setAvatars] = useState<string[]>(
    Array.from(new Set(list.map((pr) => pr.user.avatarUrl))),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 4;

    let timeout: (() => void) | undefined = undefined;

    const tick = () => {
      timeout = setTimeoutOnVisible({
        element: containerRef.current as HTMLElement,
        callback: () => {
          i += 1;

          if (i > prs.length) {
            return;
          }

          setList(prs.slice(prs.length - i, prs.length));
          setAvatars((av) => {
            prs.slice(prs.length - i + 1, prs.length).forEach((pr) => {
              if (!av.includes(pr.user.avatarUrl)) {
                av = [pr.user.avatarUrl, ...av];
              }
            });

            return av;
          });

          tick();
        },
        timeout: 2000 + (i - 4) * 300,
      });
    };

    tick();

    return () => timeout?.();
  }, [prs]);

  return (
    <>
      <div className="h-223 overflow-clip relative" ref={containerRef}>
        <div className="relative -top-77">
          <AnimatePresence initial={false}>
            {list.map((pr, index) => (
              <motion.div
                animate={{ opacity: 1, height: "auto" }}
                className="border-b border-border-faint overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                key={pr.number}
                transition={{ type: "spring", stiffness: 100, damping: 14 }}
              >
                <div className="flex gap-12 py-16 px-24">
                  <BranchIcon
                    className={cn(
                      index === 1 ? "text-heat-100" : "text-black-alpha-48",
                      "transition-colors",
                    )}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-body-medium text-accent-black mb-4 truncate">
                      {pr.title}
                    </div>

                    <div className="flex gap-10 items-center text-body-small text-black-alpha-64">
                      <div>#{pr.number}</div>
                      <div>·</div>
                      <div>{pr.updatedAt}</div>
                      <div>·</div>
                      <div className="flex gap-6">
                        <Image
                          alt={pr.user.login}
                          className="size-20 object-cover rounded-full"
                          height={20}
                          src={pr.user.avatarUrl}
                          width={20}
                        />
                        <div>{pr.user.login}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="h-248 absolute inset-x-1 bottom-0 bg-gradient-to-b from-transparent to-background-base to-95%" />
        <CurvyRect
          className="inset-x-0 absolute -top-1 h-[calc(100%+1px)]"
          allSides
        />
      </div>

      <div
        className="center-x overflow-hidden flex bottom-20 lg:-bottom-28 p-8 rounded-full bg-white-alpha-72 backdrop-blur-4 z-[3]"
        style={{
          boxShadow:
            "0px 24px 32px -12px rgba(0, 0, 0, 0.03), 0px 16px 24px -8px rgba(0, 0, 0, 0.03), 0px 8px 16px -4px rgba(0, 0, 0, 0.03), 0px 0px 0px 1px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div className="relative flex">
          {avatars.map((avatar, index) => (
            <motion.div
              animate={
                index >= 3
                  ? {
                      width: 0,
                      x: 0,
                      filter: "blur(4px)",
                      opacity: 0,
                      marginRight: 0,
                      scale: 0,

                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 14,
                      },
                    }
                  : {
                      marginRight: 8,
                      filter: "blur(0px)",
                      width: 40,
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      transition: {
                        delay: 0.2,
                        type: "spring",
                        stiffness: 220,
                        damping: 18,

                        marginRight: { delay: 0 },
                        width: { delay: 0 },
                      },
                    }
              }
              className="relative"
              initial={{
                width: 0,
                scale: 0,
                filter: "blur(4px)",
                opacity: 0,
                marginRight: 0,
              }}
              key={avatar}
            >
              <Image
                alt={avatar}
                className="w-full min-w-[40px] h-40 object-cover max-w-[unset] rounded-full"
                height={40}
                key={avatar}
                src={avatar}
                width={40}
              />
            </motion.div>
          ))}
        </div>

        <div className="py-10 px-18 rounded-full text-body-medium text-accent-black relative before:inside-border before:border-black-alpha-4">
          {`+${90 + Math.min(Math.max(avatars.length - 3, 0), 9)}`}
        </div>
      </div>
    </>
  );
}
