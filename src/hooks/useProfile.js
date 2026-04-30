import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import useRequireAuth from '@/hooks/useRequireAuth';

export const useProfile = () => {
  const { ensureAuth, isAuthenticated, requireAuth } = useRequireAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated) {
        requireAuth();
        setLoading(false);
        return;
      }

      try {
        ensureAuth();
        const data = await userService.getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [ensureAuth, isAuthenticated, requireAuth]);

  // Cập nhật profile
  const updateProfile = async (newData) => {
    setSaving(true);
    try {
      ensureAuth();
      const updatedUser = await userService.updateProfile(newData);
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Cập nhật thành công!' });
    } catch {
      setMessage({ type: 'error', text: 'Cập nhật thất bại!' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return {
    user,
    loading,
    saving,
    message,
    updateProfile
  };
};
