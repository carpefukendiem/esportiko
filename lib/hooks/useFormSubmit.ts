"use client";

import { useCallback, useState } from "react";
import { formSubmitErrorMessage } from "@/lib/data/site";

const GENERIC_ERROR = formSubmitErrorMessage;

export function useFormSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage(null);
  }, []);

  const submit = useCallback(
    async (payload: Record<string, unknown>): Promise<boolean> => {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      try {
        const res = await fetch("/api/submit-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let data: { success?: boolean; error?: string } = {};
        try {
          data = (await res.json()) as typeof data;
        } catch {
          /* empty */
        }
        if (!res.ok || !data.success) {
          setIsError(true);
          setErrorMessage(
            typeof data.error === "string" && data.error.trim()
              ? data.error
              : GENERIC_ERROR
          );
          return false;
        }
        setIsSuccess(true);
        return true;
      } catch {
        setIsError(true);
        setErrorMessage(GENERIC_ERROR);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    submit,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    reset,
  };
}
