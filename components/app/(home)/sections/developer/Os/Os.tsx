import { CurvyRect } from "@/components/shared/ui";
import Image from "@/components/shared/image/Image";

import Star from "./_svg/Star";
import DeveloperOsAnimation from "./Animation/Animation";

// Dummy GitHub PR data
const DUMMY_PRS = [
  {
    id: 1,
    number: 150,
    title: "Add new scraping endpoint",
    user: {
      login: "developer1",
      avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: "open",
    url: "https://github.com/example/repo/pull/150",
  },
  {
    id: 2,
    number: 149,
    title: "Fix authentication bug",
    user: {
      login: "developer2",
      avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: "closed",
    url: "https://github.com/example/repo/pull/149",
  },
  {
    id: 3,
    number: 148,
    title: "Update documentation",
    user: {
      login: "developer3",
      avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: "open",
    url: "https://github.com/example/repo/pull/148",
  },
  {
    id: 4,
    number: 147,
    title: "Improve performance",
    user: {
      login: "developer4",
      avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: "open",
    url: "https://github.com/example/repo/pull/147",
  },
  {
    id: 5,
    number: 146,
    title: "Add rate limiting",
    user: {
      login: "developer5",
      avatarUrl: "https://avatars.githubusercontent.com/u/5?v=4",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: "merged",
    url: "https://github.com/example/repo/pull/146",
  },
];

export default function DeveloperOs() {
  const starCount = 20500;

  return (
    <div className="w-full">
      <div className="flex py-24 px-20 lg:pl-28 justify-between lg:pr-32 relative border-b border-border-faint">
        <CurvyRect className="w-full h-0 -bottom-1 left-0 absolute" bottom />

        <div className="flex gap-16 items-center">
          <div className="size-40 relative">
            <Image
              alt="Firecrawl icon (blueprint)"
              className="cw-80 ch-80 absolute top-0 left-0 max-w-[unset]"
              height={80}
              src="developer-os-icon"
              width={80}
              raw
            />
          </div>

          <div className="flex gap-6 items-center">
            <div className="text-body-medium">
              <span className="text-black-alpha-40">mendableai/</span>firecrawl
            </div>

            <div className="px-8 rounded-full text-body-small text-black-alpha-64 before:inside-border lg-max:hidden before:border-black-alpha-5 relative">
              Public
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-2 items-center">
            <Star />
            <div className="text-body-small text-black-alpha-64">Star</div>
          </div>

          <div className="px-8 rounded-full text-body-small bg-black-alpha-5">
            {starCount}
          </div>
        </div>
      </div>

      <DeveloperOsAnimation prs={DUMMY_PRS} />
    </div>
  );
}
