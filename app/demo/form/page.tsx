import { FormDemo } from "../../demos";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">FormFieldset</h1>
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body">
          <FormDemo />
        </div>
      </div>
    </main>
  );
}
