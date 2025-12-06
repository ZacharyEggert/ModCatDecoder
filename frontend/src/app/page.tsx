import DecoderForm from "./_components/DecoderForm";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-neutral-900 to-neutral-600 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          PRS MODCAT Decoder
        </h1>
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <DecoderForm />
        </div>
        <section className="max-w-2xl text-center text-lg">
          <p className="mb-4">
            This is a fork of the ModCat Decoder tool by{" "}
            <a
              className="underline hover:text-gray-300"
              href="https://github.com/DChandlerP/ModCatDecoder/"
            >
              DChandlerP
            </a>{" "}
            on GitHub.
          </p>
        </section>
      </div>
    </main>
  );
}
