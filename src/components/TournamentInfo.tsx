
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Award, ChevronDown, ChevronUp } from "lucide-react";

export const TournamentInfo = () => {
  const [showKeyPoints, setShowKeyPoints] = useState(false);

  const categories = [
    { name: "Men's Open Doubles", icon: "👨‍🤝‍👨", color: "bg-emerald-500" },
    { name: "Women's Open Doubles", icon: "👩‍🤝‍👩", color: "bg-teal-500" },
    { name: "Mixed Doubles", icon: "👫", color: "bg-cyan-500" },
    { name: "Veterans Doubles", icon: "🏆", color: "bg-sky-500" },
    { name: "Junior Doubles", icon: "🎾", color: "bg-blue-500" },
  ];

  const keyPoints = [
    "Maximum 2 categories per player",
    "Partner selection during registration",
    "Registration includes accommodation preference",
    "Food preference options available",
    "Official tournament apparel sizing",
    "Fee payment tracking",
    "WhatsApp number required for communication",
    "Date of birth verification for categories",
    "City information for participant tracking",
    "Ranking system for tournament seeding",
    "Partner pairing flexibility",
    "Registration modification allowed",
    "Administrative oversight and management",
    "Comprehensive player database",
    "Tournament bracket generation",
    "Results tracking and recording",
    "Player statistics maintenance",
    "Communication system integration",
    "Event scheduling coordination",
    "Equipment and facility requirements",
    "Photography and media coverage",
    "Awards and recognition ceremony",
  ];

  return (
    <div id="tournaments-section" className="py-12 bg-gradient-to-br from-white via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        {/* Tournament Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-2 text-yellow-300" />
              <CardTitle className="text-white">5 Categories</CardTitle>
              <CardDescription className="text-emerald-100">Multiple tournament categories available</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-2 text-teal-100" />
              <CardTitle className="text-white">Doubles Format</CardTitle>
              <CardDescription className="text-teal-100">Team up with partners for exciting matches</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-cyan-100" />
              <CardTitle className="text-white">Annual Event</CardTitle>
              <CardDescription className="text-cyan-100">Prestigious yearly tournament</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-gradient-to-br from-sky-500 to-sky-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Award className="h-12 w-12 mx-auto mb-2 text-sky-100" />
              <CardTitle className="text-white">2 Categories Max</CardTitle>
              <CardDescription className="text-sky-100">Each player can participate in up to 2 categories</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Available Categories */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center flex items-center justify-center">
                <Trophy className="mr-3" />
                Available Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white font-bold mr-4`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-semibold text-gray-800">{category.name}</span>
                      <span className="ml-3 text-2xl">{category.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Points Dropdown */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center flex items-center justify-center">
                <Award className="mr-3" />
                Tournament Key Points
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                onClick={() => setShowKeyPoints(!showKeyPoints)}
                className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white py-4 text-lg font-semibold"
              >
                {showKeyPoints ? (
                  <>
                    Hide Key Points <ChevronUp className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    View All Key Points <ChevronDown className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              {showKeyPoints && (
                <div className="mt-6 space-y-3 max-h-80 overflow-y-auto">
                  {keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-sky-50 hover:from-cyan-100 hover:to-sky-100 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
