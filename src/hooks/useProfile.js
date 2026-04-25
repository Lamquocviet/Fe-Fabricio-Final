import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Cập nhật profile
  const updateProfile = async (newData) => {
    setSaving(true);
    try {
      const updatedUser = await userService.updateProfile(newData);
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Cập nhật thành công!' });
    } catch (error) {
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