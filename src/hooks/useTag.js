import { useState, useEffect } from 'react';
import { getTags, createTag } from '@/services/tagService';

export const useTag = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                setError(null);

                const fetchedTags = await getTags();
                setTags(fetchedTags);
            } catch (err) {
                console.error(err);
                setError('Failed to load tags');
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    const handleCreateTag = async (tagData) => {
        try {
            setLoading(true);
            setError(null);

            const createdTag = await createTag(tagData);
            setTags([...tags, createdTag]);
        } catch (err) {
            console.error(err);
            setError('Failed to create tag');
        } finally {
            setLoading(false);
        }
    };

    return { tags, loading, error, handleCreateTag };
};
