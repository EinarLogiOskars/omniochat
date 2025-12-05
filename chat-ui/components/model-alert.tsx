"use client";

import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function ModelAlert() {
    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Please choose a model!</AlertTitle>
            <AlertDescription>
                You cannot chat unless you have chosen a model.
            </AlertDescription>
        </Alert>
    )
}