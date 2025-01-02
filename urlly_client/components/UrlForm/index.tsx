"use client";

import { useActionState, useMemo } from "react";
import { generateUrl } from "@/app/actions/url.actions";

import UrlDisplay from "../UrlDisplay";

const initialData = {
  short: "#",
  long: "#",
  message: '',
};

export default function UrlForm() {
  const [state, formAction, pending] = useActionState(generateUrl, initialData);
  const randomNumber = useMemo(
    () => Math.floor(Math.random() * (100_000 - 1_000 + 1)) + 1_000,
    []
  );

  return (
    <div className="container flex justify-center form gap-10 flex-col">
      <form action={formAction} className="w-full form gap-10 flex flex-col">
        <div>
          <div className="label">
            <span className="label-text">What is the URL?</span>
            <span className="label-text-alt">
              Generated {1_000_00 + new Date().getTime() + randomNumber} URLs
            </span>
          </div>
          <input
            type="url"
            name='url'
            placeholder="https://google.com"
            className="input input-bordered input-primary w-full"
            required
          />
          <div className="label">
            {state.message && <span className="label-text-alt text-red-500">{state.message}</span>}
          </div>
        </div>

        <button
          disabled={pending}
          type="submit"
          className="flex-grow btn btn-primary"
        >
          Generate new URLs
        </button>
      </form>

      <UrlDisplay label="Shortened" url={state.short} />
      <UrlDisplay label="Lengthened" url={state.long} />
    </div>
  );
}
