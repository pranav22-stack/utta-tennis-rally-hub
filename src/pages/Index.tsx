
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar, Award } from "lucide-react";
import { AdminLogin } from "@/components/AdminLogin";
import { UserLogin } from "@/components/UserLogin";
import { RegistrationForm } from "@/components/RegistrationForm";

const Index = () => {
  const [activeView, setActiveView] = useState<'home' | 'admin' | 'user' | 'register'>('home');

  if (activeView === 'admin') {
    return <AdminLogin onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'user') {
    return <UserLogin onBack={() => setActiveView('home')} />;
  }

  if (activeView === 'register') {
    return <RegistrationForm onBack={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <div className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Uttaranchal Tennis Association</h1>
          <p className="text-xl opacity-90">Annual Doubles Tournament Registration</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Tournament Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>5 Categories</CardTitle>
              <CardDescription>Multiple tournament categories available</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Doubles Format</CardTitle>
              <CardDescription>Team up with partners for exciting matches</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Annual Event</CardTitle>
              <CardDescription>Prestigious yearly tournament</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>2 Categories Max</CardTitle>
              <CardDescription>Each player can participate in up to 2 categories</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tournament Details */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Tournament Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Available Categories:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>Men's Open Doubles</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>Women's Open Doubles</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>Mixed Doubles</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>Veterans Doubles</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>Junior Doubles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Key Points:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Maximum 2 categories per player</li>
                  <li>• Partner selection during registration</li>
                  <li>• Registration includes accommodation preference</li>
                  <li>• Food preference options available</li>
                  <li>• Official tournament apparel sizing</li>
                  <li>• Fee payment tracking</li>
                  <li>• WhatsApp number required for communication</li>
                  <li>• Date of birth verification for categories</li>
                  <li>• City information for participant tracking</li>
                  <li>• Ranking system for tournament seeding</li>
                  <li>• Partner pairing flexibility</li>
                  <li>• Registration modification allowed</li>
                  <li>• Administrative oversight and management</li>
                  <li>• Comprehensive player database</li>
                  <li>• Tournament bracket generation</li>
                  <li>• Results tracking and recording</li>
                  <li>• Player statistics maintenance</li>
                  <li>• Communication system integration</li>
                  <li>• Event scheduling coordination</li>
                  <li>• Equipment and facility requirements</li>
                  <li>• Photography and media coverage</li>
                  <li>• Awards and recognition ceremony</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => setActiveView('admin')}
            variant="outline" 
            className="w-full sm:w-auto px-8 py-4 text-lg border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            Admin Login
          </Button>
          
          <Button 
            onClick={() => setActiveView('register')}
            className="w-full sm:w-auto px-8 py-4 text-lg bg-green-600 hover:bg-green-700"
          >
            Register for Tournament
          </Button>
          
          <Button 
            onClick={() => setActiveView('user')}
            variant="outline"
            className="w-full sm:w-auto px-8 py-4 text-lg border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            User Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
