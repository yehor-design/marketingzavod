// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BG_DRAFTS } from "@/content/bg/drafts";
import { bgUi } from "@/content/bg/ui";

afterEach(() => {
  cleanup();
  vi.resetModules();
  vi.unstubAllEnvs();
});

describe("GlobalError BG edition (NF-02)", () => {
  it("renders approved Bulgarian draft copy with lang=bg and invokes reset on button click", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_EDITION", "bg");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { default: GlobalError } = await import("@/app/global-error");
    const reset = vi.fn();

    render(<GlobalError error={new Error("boom")} reset={reset} />);

    expect(bgUi.globalError.lang).toBe("bg");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      BG_DRAFTS.globalErrorTitle.value,
    );
    expect(screen.getByText(BG_DRAFTS.globalErrorBody.value)).toBeTruthy();

    const button = screen.getByRole("button", { name: BG_DRAFTS.globalErrorReload.value });
    fireEvent.click(button);
    expect(reset).toHaveBeenCalledTimes(1);

    errorSpy.mockRestore();
  });
});
