import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeleton = Array(6).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col bg-base-100">
      <div className="border-b border-base-300 w-full p-4 flex items-center gap-3">
        <Users className="w-5 h-5" />
        <span className="hidden lg:block font-medium">Contacts</span>
      </div>

      <div className="px-3 py-3 hidden lg:block">
        <div className="h-8 w-full bg-base-200 rounded animate-pulse" />
      </div>

      <div className="overflow-y-auto w-full py-2">
        {skeleton.map((_, i) => (
          <div key={i} className="w-full p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-base-200 animate-pulse" />
            <div className="hidden lg:flex flex-col gap-2 flex-1">
              <div className="h-4 w-36 bg-base-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-base-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
