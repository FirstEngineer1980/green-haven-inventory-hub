import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import FormsPage from '@/pages/Form/FormsPage';
import CreateForm from '@/pages/Form/CreateForm';
import FormResponses from '@/pages/Form/FormResponses';
import FormResponseDetail from '@/pages/Form/FormResponseDetail';
import AppLayout from '@/components/Layout/AppLayout';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import Landing from "@/pages/Landing";

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />

        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<FormsPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="forms" element={<FormsPage />} />
          <Route path="forms/create" element={<CreateForm />} />
          <Route path="forms/:formId/responses" element={<FormResponses />} />
          <Route path="forms/:formId/responses/:responseId" element={<FormResponseDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default AppRoutes;