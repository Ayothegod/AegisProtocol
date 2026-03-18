import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: AppComponent,
});

function AppComponent() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-10">DevJokes</h1>
    </div>
  );
}
