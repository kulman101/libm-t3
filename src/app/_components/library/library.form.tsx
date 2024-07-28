"use client";

import { Button, Card, Input, Spacer } from "@nextui-org/react";
import { formDataToObject } from "@trpc/server/unstable-core-do-not-import";
import React from "react";
import { api } from "~/trpc/react";

export default function LibraryForm() {
  const { mutate, error } = api.library.create.useMutation();

  async function createLibrary(formData: FormData) {
    mutate(formDataToObject(formData))
  }

  return (
    <Card className="p-4 w-80">
      <form action={createLibrary} className="flex flex-col gap-2 align-middle">
        <Input
          type="text"
          name="name"
          label="Library Name"
          placeholder="Enter the library name"
        />

        <Spacer y={1} />
        <Button type="submit" color="secondary">
          Add Library
        </Button>
      </form>
    </Card>
  );
}
