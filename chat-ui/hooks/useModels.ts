import fetchModels from "@/lib/api/fetchModels";
import { Models } from "@/types/models";
import { useEffect, useState } from "react";

export function useModels() {
    const [models, setModels] = useState<Models>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await fetchModels();
            const data = await res.json();
            setModels(data.models ?? []);
            setLoading(false);
        }
        load();
    }, []);

    return { models, loading };
}