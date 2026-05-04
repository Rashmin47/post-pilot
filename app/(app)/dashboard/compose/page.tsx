import { ComposerForm } from "@/components/posts/composer-form";

export const metadata = {
  title: "Compose Post | PostPilot",
  description: "Create and schedule posts across multiple social media platforms.",
};

export default function ComposePage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Post Composer</h1>
        <p className="text-[#64748b]">
          Write once, publish everywhere. Craft the perfect post for all your channels.
        </p>
      </div>

      <ComposerForm />
    </div>
  );
}
