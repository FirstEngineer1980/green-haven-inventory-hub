
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-gh-blue" />
              <p>contact@example.com</p>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-gh-blue" />
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-gh-blue" />
              <p>123 Business Street, Suite 100<br />City, State 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
