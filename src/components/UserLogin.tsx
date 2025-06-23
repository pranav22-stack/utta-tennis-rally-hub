
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserDashboard } from "./UserDashboard";

interface UserLoginProps {
  onBack: () => void;
}

export const UserLogin = ({ onBack }: UserLoginProps) => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('tbl_players')
        .select('*')
        .eq('whatsapp_number', whatsappNumber)
        .eq('date_of_birth', dateOfBirth)
        .single();

      if (error || !data) {
        toast({
          title: "Login Failed",
          description: "Invalid WhatsApp number or date of birth",
          variant: "destructive",
        });
        return;
      }

      setUser(data);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <UserDashboard user={user} onBack={onBack} onLogout={() => setUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Player Login</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">Login to Your Account</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white/90 backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="whatsapp" className="text-gray-700">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                  className="border-cyan-200 focus:border-cyan-500"
                />
              </div>

              <div>
                <Label htmlFor="dob" className="text-gray-700">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="border-cyan-200 focus:border-cyan-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
